import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

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

  province = '';
  district = '';
  ward = '';

  provinces: any[];
  cities: any[];
  wards: any[];

  selectedProvince: any;
  selectedCity: any;
  selectedWard: any;

  constructor(
    private _api: ApiService,
    private _token: TokenStorageService,
    private _router: Router,
    private _auth: AuthService,
    private _cart: CartService
  ) { }

  // Update user fields with current details
  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    this._auth.getProfileUser().subscribe(
      (res: any) => {

        this.user[0].value = res.first_name;
        this.user[1].value = res.last_name;
        this.user[2].value = res.email;

        this.selectedProvince = res.province
        this.selectedCity = res.district
        this.selectedWard = res.ward

        this.getProvince()
        this.getDistrict()
        this.getWard()

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
    this.loading = true;
    this._api
      .putTypeRequest('users/update-user', {
        first_name: this.user[0].value,
        last_name: this.user[1].value,
        email: this.user[2].value,
        province: this.province,
        district: this.district,
        ward: this.ward
      })
      .subscribe(
        (res: any) => {
          // console.log("success")
          this.alertMessage = 'success';
          this.alertType = 'success';
          this.alertVisible = true;
          this.loading = false;


          // this.getUser()
        },
        (err: any) => {

          this.alertMessage = 'error';
          this.alertVisible = true;
          this.alertType = 'error';
          this.loading = false;
        }
      );
  }



  getProvince() {
    this._cart.getProvinces().subscribe(
      (data: any) => {
        this.provinces = data.data;
      },
      (error) => { }
    );
  }
  getDistrict() {

    this._cart.getCities(parseInt(this.selectedProvince)).subscribe(
      (data: any) => {
        this.cities = data.data;
      },
      (error) => { }
    );
  }
  getWard() {
    this._cart.getWard(parseInt(this.selectedCity)).subscribe(
      (data: any) => {
        this.wards = data.data;
      },
      (error) => { }
    );
  }

  onProvinceChange() {
    this.province = this.selectedProvince;
    this.getDistrict()
  }
  onCityChange() {
    this.district = this.selectedCity;
    this.getWard()
  }

  onWardChange() {
    this.ward = this.selectedWard;
  }
}
