import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import type {
  AuthMiddlewareOptions,
  Client,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

import { tokenCacheAnon, tokenCacheAuth } from './token-cache';

enum Session {
  ANON = 'anon',
  AUTH = 'auth',
}

class AuthenticationService {
  protected root: ByProjectKeyRequestBuilder;

  protected BASE_URI: string = process.env.CTP_API_URL || '';

  protected OAUTH_URI: string = process.env.CTP_AUTH_URL || '';

  private CLIENT_ID: string = process.env.CTP_CLIENT_ID || '';

  private CLIENT_SECRET: string = process.env.CTP_CLIENT_SECRET || '';

  private PROJECT_KEY: string = process.env.CTP_PROJECT_KEY || '';

  constructor() {
    this.root = this.createRoot(this.getAnonymousClient());
  }

  protected createRoot(client: Client): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: this.PROJECT_KEY,
    });
  }

  public getRoot(): ByProjectKeyRequestBuilder {
    return this.root;
  }

  protected getHttpMiddlewareOptions(): HttpMiddlewareOptions {
    return {
      host: this.BASE_URI,
    };
  }

  protected getAuthMiddlewareOptions(): AuthMiddlewareOptions {
    return {
      host: this.OAUTH_URI,
      projectKey: this.PROJECT_KEY,
      credentials: {
        clientId: this.CLIENT_ID,
        clientSecret: this.CLIENT_SECRET,
      },
      tokenCache: tokenCacheAnon,
    };
  }

  protected getPasswordAuthMiddlewareOptions(email: string, password: string): PasswordAuthMiddlewareOptions {
    return {
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
    };
  }

  public getRefreshMiddlewareOptions(refreshToken: string): RefreshAuthMiddlewareOptions {
    return {
      host: this.OAUTH_URI,
      projectKey: this.PROJECT_KEY,
      credentials: {
        clientId: this.CLIENT_ID,
        clientSecret: this.CLIENT_SECRET,
      },
      refreshToken,
    };
  }

  protected getPasswordFlowClient(email: string, password: string): Client {
    return new ClientBuilder()
      .withPasswordFlow(this.getPasswordAuthMiddlewareOptions(email, password))
      .withHttpMiddleware(this.getHttpMiddlewareOptions())
      .build();
  }

  protected getAnonymousClient(): Client {
    return new ClientBuilder()
      .withAnonymousSessionFlow(this.getAuthMiddlewareOptions())
      .withHttpMiddleware(this.getHttpMiddlewareOptions())
      .build();
  }

  protected getRefreshClient(session: Session): Client {
    return new ClientBuilder()
      .withRefreshTokenFlow(this.getRefreshMiddlewareOptions(this.getRefreshTokenFromStorage(session)))
      .withHttpMiddleware(this.getHttpMiddlewareOptions())
      .build();
  }

  private getRefreshTokenFromStorage(sessionType: Session): string {
    const token = localStorage.getItem(`${sessionType}-${process.env.CTP_PROJECT_KEY}`);
    if (!token) {
      return '';
    }
    return JSON.parse(token).refreshToken;
  }

  public sessionStateHandler(): void {
    let apiRoot = this.getRoot();

    if (this.getRefreshTokenFromStorage(Session.AUTH) !== '') {
      apiRoot = createApiBuilderFromCtpClient(this.getRefreshClient(Session.AUTH)).withProjectKey({
        projectKey: this.PROJECT_KEY,
      });
      console.log('customer session is restored');
    } else if (this.getRefreshTokenFromStorage(Session.ANON) !== '') {
      apiRoot = createApiBuilderFromCtpClient(this.getRefreshTokenFromStorage(Session.ANON)).withProjectKey({
        projectKey: this.PROJECT_KEY,
      });
      console.log('anon session is restored');
    } else {
      apiRoot.get().execute();
      console.log('new anon session started');
    }
  }

  public async login(email: string, password: string): Promise<void> {
    this.root = this.createRoot(this.getPasswordFlowClient(email, password));
    await this.root
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();
    // To delete previous anon session
    // localStorage.removeItem(`${Session.ANON}-${this.PROJECT_KEY}`);
    localStorage.setItem('logged', 'true');
    console.log('login');
  }

  public logout(): void {
    localStorage.removeItem(`${Session.AUTH}-${this.PROJECT_KEY}`);
    localStorage.removeItem('logged');
    // localStorage.clear();
    this.sessionStateHandler();
    console.log('logout');
  }
}

const AuthService = new AuthenticationService();
export default AuthService;
