import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user = [
    {
      key: 'firstName',
      label: 'First name',
      value: '',
      type: 'text',
    },
    {
      key: 'lastName',
      label: 'Last name',
      value: '',
      type: 'text',
    },
    {
      key: 'email',
      label: 'Email address',
      value: '',
      type: 'email',
    },

  ];
  // userId = null;
  alertMessage = '';
  alertType = '';
  alertVisible = false;
  loading = false;

  constructor(
    private _api: ApiService,
    private _token: TokenStorageService,
    private _router: Router,
    private _auth: AuthService
  ) { }

  // Update user fields with current details
  ngOnInit(): void {
    // const { first_name, last_name, phone } = this._token.getUser();
    // this.userId = user_id;


    this.getUser()

    // this.user[0].value = fname;
    // this.user[1].value = email;


  }

  getUser() {
    this._auth.getProfileUser().subscribe(
      (res: any) => {
        this.user[0].value = res.first_name;
        this.user[1].value = res.last_name;
        this.user[2].value = res.email;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    )
  }

  canUpdate(): boolean {
    return this.user.filter((field) => field.value.length > 0).length !== 3
      ? true
      : false;
  }

  // Submit data to be updated
  onSubmit(): void {
    this.alertVisible = false;
    // this.loading = true;
    // this._api
    //   .putTypeRequest(`users/${this.userId}`, {
    //     fullName: this.user[0].value,
    //     email: this.user[1].value,
    //     password: this.user[2].value,
    //   })
    //   .subscribe(
    //     (res: any) => {
    //       console.log(res);
    //       this.alertMessage = res.message;
    //       this.alertType = 'success';
    //       this.alertVisible = true;
    //       this.loading = false;
    //       const oldDetails = this._token.getUser();
    //       this._token.setUser({
    //         ...oldDetails,
    //         fname: this.user[0].value,
    //         email: this.user[1].value,
    //       });
    //       this.user[2].value = '';
    //       this.user[3].value = '';
    //     },
    //     (err: any) => {
    //       console.log(err);
    //       this.alertMessage = err.error.message;
    //       this.alertVisible = true;
    //       this.alertType = 'error';
    //       this.loading = false;
    //     }
    //   );
  }
}
