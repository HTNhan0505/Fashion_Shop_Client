import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  first_name = '';
  last_name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  loading = false;
  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.first_name && this.last_name && this.password && this.phone && this.email && this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords need to match';
      } else {
        this.loading = true;
        this._auth
          .register({
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            phone: this.phone,
            password: this.password,
          })
          .subscribe(
            (res) => {
              // console.log(res.data.userCode)
              this.loading = false;
              localStorage.setItem('userCode', res.data.userCode)
              this._router.navigate(['/verify']);
            },
            (err) => {
              if (err.status === 400) {
                this.errorMessage = 'Email or phone number already exists';
              } else {
                this.errorMessage = 'Please check all fields again'
              }
              this.loading = false;
            }
          );
      }
    } else {
      this.errorMessage = 'Make sure to fill everything ;)';
    }
  }

  canSubmit(): boolean {
    return this.first_name && this.last_name && this.password && this.phone && this.email && this.confirmPassword
      ? true
      : false;
  }
}
