import type { TokenCache, TokenCacheOptions, TokenStore } from '@commercetools/sdk-client-v2';

const tokenCacheAnon: TokenCache = {
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

export { tokenCacheAuth, tokenCacheAnon };
