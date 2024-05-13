import type { CustomerDraft } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import type { AuthMiddlewareOptions, Client, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

import { tokenCacheAnon, tokenCacheAuth } from './tocken-cache';

class AuthenticationService {
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
      tokenCache: tokenCacheAnon,
    };
  }

  protected getHttpMiddlewareOptions(): HttpMiddlewareOptions {
    return {
      host: this.BASE_URI,
    };
  }

  // protected getDefaultClient(): Client {
  //   return new ClientBuilder()
  //     .withClientCredentialsFlow(this.getAuthMiddlewareOptions())
  //     .withHttpMiddleware(this.getHttpMiddlewareOptions())
  //     .build();
  // }

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

  public async signUp(customerDraft: CustomerDraft) {
    try {
      await this.root
        .customers()
        .post({
          body: customerDraft,
        })
        .execute()
        .then(() => {
          // TODO: implement auto-login after account creation
          console.log(`Account was created! login: ${customerDraft.email} password: ${customerDraft.password}`);
          // TODO Redirect to main page
          // Show message after signup success
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }
}

const AuthService = new AuthenticationService();
export default AuthService;
