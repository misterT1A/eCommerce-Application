import type { TokenStore } from '@commercetools/sdk-client-v2';

import { tokenCacheAnon, tokenCacheAuth } from '@services/token-cache';

describe('TokenCache tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Anon', () => {
    it('should set and get the anonymous token from localStorage', () => {
      const tokenStore: TokenStore = {
        expirationTime: Date.now(),
        token: 'testAnon',
        refreshToken: 'testAnonRefresh',
      };
      tokenCacheAnon.set(tokenStore);
      const cached = tokenCacheAnon.get();

      expect(cached).toEqual(tokenStore);
    });
  });

  describe('Auth', () => {
    it('should set and get the authentication token from localStorage', () => {
      const tokenStore: TokenStore = {
        expirationTime: Date.now(),
        token: 'testAuth',
        refreshToken: 'testAuthRefresh',
      };
      tokenCacheAuth.set(tokenStore);
      const cached = tokenCacheAuth.get();

      expect(cached).toEqual(tokenStore);
    });
  });
});
