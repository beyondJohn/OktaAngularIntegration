import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as OktaAuth from '@okta/okta-auth-js';

@Injectable({
  providedIn: 'root'
})
export class OktaAuthService implements CanActivate {

  constructor() { }

  CLIENT_ID = '0oa354lxqIpslTgwm4x6';
  ISSUER = 'https://beyondlogical.okta.com/oauth2/default'
  LOGIN_REDIRECT_URI = 'http://localhost:4200';
  LOGOUT_REDIRECT_URI = 'http://localhost:4200';
  oktaAuth = new OktaAuth({
    clientId: this.CLIENT_ID,
    issuer: this.ISSUER,
    redirectUri: this.LOGIN_REDIRECT_URI,
    pkce: true
  });

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.oktaAuth.tokenManager.get('idToken')
      .then(idToken => {
        console.log('idToken: ', idToken);
        const expirationDate = new Date((idToken.expiresAt * 1000));
        console.log('idToken expiresAt: ', expirationDate);
        this.checkExpired();
        return true;
      })
      .catch(error => {
        console.log('error: ', error);
        return this.writeTokens();
      }
      );
  }
  writeTokens(): boolean {
    return this.oktaAuth.token.parseFromUrl().then(tokens => { // manage token or tokens 
      console.log('tokenOrTokens: ', tokens);
      console.log('token keys', Object.keys(tokens));
      if (tokens.tokens.idToken) {
        console.log('tokens.idToken:', tokens.tokens.idToken)
        this.oktaAuth.tokenManager.add("idToken", tokens.tokens.idToken);
      }
      if (tokens.tokens.accessToken) {
        console.log('tokens.accessToken:', tokens.tokens.accessToken)
        this.oktaAuth.tokenManager.add("accessToken", tokens.tokens.accessToken);
      }
      this.checkLogin();
      return true;
    }).catch(error => { this.checkLogin(); return false; });


  }
  async checkLogin() {
    const authenticated = await this.oktaAuth.tokenManager.get("accessToken");
    if (authenticated === undefined) {
      // Save current URL before redirect
      sessionStorage.setItem('okta-app-url', 'http://localhost:4200');

      // Launches the login redirect.
      this.oktaAuth.token.getWithRedirect({
        scopes: ['openid', 'email', 'profile']
        , responseMode: "query"
        , responseType: "token"
      });
    }
    else {
      this.checkExpired();
    }
  }
  async checkExpired() {
    const authenticated = await this.oktaAuth.tokenManager.get("accessToken");
    const expirationDate = new Date((authenticated.expiresAt * 1000));
    console.log('accessToken expiresAt: ', expirationDate);
  }
}
