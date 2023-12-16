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
  loading = false;
  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.userCode = localStorage.getItem('userCode')
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.verifyCode) {
      this.loading = true;
      this._auth
        .verify({
          userCode: this.userCode,
          verifyCode: this.verifyCode,
        })
        .subscribe(
          (res) => {
            // console.log(res)
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
    }
  }

  canSubmit(): boolean {
    return this.verifyCode
      ? true
      : false;
  }
}
