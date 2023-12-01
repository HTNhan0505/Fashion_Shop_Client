import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private _api: ApiService, private _token: TokenStorageService) {
    this.userSubject = new BehaviorSubject<any>(this._token.getUser());
    this.user = this.userSubject.asObservable();
  }

  getUser() {
    return this.userSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this._api
      .postTypeRequest('users/login', {
        email: credentials.email,
        password: credentials.password,
      })
      .pipe(
        map((res: any) => {
          let user = {
            email: credentials.email,
            token: res.token,
          };
          this._token.setToken(res.token);
          // this._token.setUser(res.data[0]);
          this.userSubject.next(user);
          return user;
        })
      );
  }

  register(user: any): Observable<any> {
    return this._api.postTypeRequest('users/signup', {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      password: user.password,
    });
  }

  verify(user: any): Observable<any> {
    return this._api.postTypeRequest('users/verify', {
      userCode: user.userCode,
      verifyCode: user.verifyCode,
    });
  }

  logout() {
    this._token.clearStorage();
    this.userSubject.next(null);

  }
}
