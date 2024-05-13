import type { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

const tokenCacheAnon: TokenCache = {
  get: (): TokenStore => {
    const cached = JSON.parse(localStorage.getItem(`anon-${process.env.CTP_PROJECT_KEY}`) || '{}');
    return {
      expirationTime: cached.expirationTime || 0,
      token: cached.token || '',
      refreshToken: cached.refreshToken || '',
    };
  },
  set: (cache: TokenStore) => {
    localStorage.setItem(`anon-${process.env.CTP_PROJECT_KEY}`, JSON.stringify(cache));
  },
};

const tokenCacheAuth: TokenCache = {
  get: (): TokenStore => {
    const cached = JSON.parse(localStorage.getItem(`auth-${process.env.CTP_PROJECT_KEY}`) || '{}');
    return {
      expirationTime: cached.expirationTime || 0,
      token: cached.token || '',
      refreshToken: cached.refreshToken || '',
    };
  },
  set: (cache: TokenStore) => {
    localStorage.setItem(`auth-${process.env.CTP_PROJECT_KEY}`, JSON.stringify(cache));
  },
};

export { tokenCacheAuth, tokenCacheAnon };
