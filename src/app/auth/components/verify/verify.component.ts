import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  verifyCode = ""
  errorMessage = '';
  userCode = '';
  emailUser = ''
  password = '';
  confirmPassword = '';
  loading = false;
  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.userCode = localStorage.getItem('userCode')
    this.emailUser = localStorage.getItem('emailUser')
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.verifyCode) {
      if (this.userCode) {
        this.loading = true;
        this._auth
          .verify({
            userCode: this.userCode,
            verifyCode: this.verifyCode,
          })
          .subscribe(
            (res) => {
              this.loading = false;
              this._router.navigate(['/login']);
              localStorage.removeItem("userCode");
            },
            (err) => {
              console.log(err)
              this.loading = false;
              this.errorMessage = 'Verify Wrong';
            }
          );
      } else {
        this.loading = true;
        if (this.password != this.confirmPassword) {
          this.errorMessage = 'Password must be same confirm password';
          this.loading = false;
        } else {
          this._auth
            .updatePassWord({
              email: this.emailUser,
              verifyCode: this.verifyCode,
              password: this.password
            })
            .subscribe(
              (res) => {
                this.loading = false;
                this._router.navigate(['/login']);
                localStorage.removeItem("emailUser");
              },
              (err) => {
                console.log(err)
                this.loading = false;
                this.errorMessage = 'Have error';

              }
            );
        }

      }

    }
  }

  canSubmit(): boolean {
    return this.verifyCode
      ? true
      : false;
  }
}
