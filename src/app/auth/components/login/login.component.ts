import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  loading = false;
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _notification: NzNotificationService,
    private _share: ShareService,
  ) { }

  ngOnInit(): void { }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Make sure to fill everything ;)';
    } else {
      this._auth
        .login({ email: this.email, password: this.password })
        .subscribe(
          (res) => {
            this.loading = false;
            this._router.navigate(['/']);
            this._share.sendClickEvent();
          },
          (err) => {
            // console.log(err);
            this.error = err.error.message;
            this.loading = false;
            this._notification.error(
              'Error',
              'Email or password incorrect',

              { nzPlacement: 'bottomLeft' }
            );
          }
        );
    }
  }

  canSubmit(): boolean {
    return this.email.length > 0 && this.password.length > 0;
  }
}
