import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import type {
  AuthMiddlewareOptions,
  Client,
  HttpMiddlewareOptions,
  TokenCache,
  TokenCacheOptions,
  TokenStore,
} from '@commercetools/sdk-client-v2';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

// interface IBaseApiOptions {
//   host: string;
//   projectKey: string;
//   credentials: {
//     clientId: string;
//     clientSecret: string;
//   };
//   tokenCache: TokenCache;
// }

const tokenCache: TokenCache = {
  get: (options?: TokenCacheOptions): TokenStore => {
    const cached = JSON.parse(sessionStorage.getItem(`${options?.projectKey}-anon`) || '{}');
    return {
      expirationTime: cached.expirationTime || 0,
      token: cached.token || '',
      refreshToken: cached.refreshToken || '',
    };
  },
  set: (cache: TokenStore, options?: TokenCacheOptions) => {
    sessionStorage.setItem(`${options?.projectKey}-anon`, JSON.stringify(cache));
  },
};

const tokenCacheAuth: TokenCache = {
  get: (options?: TokenCacheOptions): TokenStore => {
    const cached = JSON.parse(sessionStorage.getItem(`${options?.projectKey}-auth`) || '{}');
    return {
      expirationTime: cached.expirationTime || 0,
      token: cached.token || '',
      refreshToken: cached.refreshToken || '',
    };
  },
  set: (cache: TokenStore, options?: TokenCacheOptions) => {
    sessionStorage.setItem(`${options?.projectKey}-auth`, JSON.stringify(cache));
  },
};

class AuthService {
  protected root: ByProjectKeyRequestBuilder;

  protected BASE_URI: string = process.env.CTP_API_URL || '';

  protected OAUTH_URI: string = process.env.CTP_AUTH_URL || '';

  private CLIENT_ID: string = process.env.CTP_CLIENT_ID || '';

  private CLIENT_SECRET: string = process.env.CTP_CLIENT_SECRET || '';

  private PROJECT_KEY: string = process.env.CTP_PROJECT_KEY || '';

  constructor() {
    this.root = this.creteRoot(this.getAnonymousClient());
  }

  protected getAuthMiddlewareOptions(): AuthMiddlewareOptions {
    return {
      host: this.OAUTH_URI,
      projectKey: this.PROJECT_KEY,
      credentials: {
        clientId: this.CLIENT_ID,
        clientSecret: this.CLIENT_SECRET,
      },
      tokenCache,
    };
  }

  protected getHttpMiddlewareOptions(): HttpMiddlewareOptions {
    return {
      host: this.BASE_URI,
    };
  }

  protected getDefaultClient(): Client {
    return new ClientBuilder()
      .withClientCredentialsFlow(this.getAuthMiddlewareOptions())
      .withHttpMiddleware(this.getHttpMiddlewareOptions())
      .build();
  }

  protected getLoggedClient(email: string, password: string): Client {
    return new ClientBuilder()
      .withPasswordFlow({
        host: this.OAUTH_URI,
        projectKey: this.PROJECT_KEY,
        credentials: {
          clientId: this.CLIENT_ID,
          clientSecret: this.CLIENT_SECRET,
          user: {
            username: email,
            password,
          },
        },
        tokenCache: tokenCacheAuth,
      })
      .withHttpMiddleware(this.getHttpMiddlewareOptions())
      .build();
  }

  protected getAnonymousClient(): Client {
    return new ClientBuilder()
      .withAnonymousSessionFlow(this.getAuthMiddlewareOptions())
      .withHttpMiddleware(this.getHttpMiddlewareOptions())
      .build();
  }

  protected creteRoot(client: Client) {
    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: this.PROJECT_KEY,
    });
  }

  public getRoot(): ByProjectKeyRequestBuilder {
    return this.root;
  }

  public async login(email: string, password: string) {
    this.root = this.creteRoot(this.getLoggedClient(email, password));
    await this.root.get().execute();
  }
}

const authService = new AuthService();
export default authService;
