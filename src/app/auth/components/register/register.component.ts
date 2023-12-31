import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from '../../../services/api.service';
import { CartService } from 'src/app/services/cart.service';

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
  province = '';
  district = '';
  ward = '';
  loading = false;

  provinces: any[];
  cities: any[];
  wards: any[];

  selectedProvince: string;
  selectedCity: string;
  selectedWard: string;

  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _router: Router,
    private _cart: CartService
  ) { }

  ngOnInit(): void {
    this.getProvince();
    localStorage.clear()
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (
      this.first_name &&
      this.last_name &&
      this.password &&
      this.phone &&
      this.email &&
      this.confirmPassword &&
      this.province &&
      this.district &&
      this.ward
    ) {
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
            province: this.province,
            district: this.district,
            ward: this.ward
          })
          .subscribe(
            (res) => {
              this.loading = false;
              localStorage.setItem('userCode', res.data.userCode);
              this._router.navigate(['/verify']);
            },
            (err) => {
              if (err.status === 400) {
                this.errorMessage = 'Email or phone number already exists';
              } else {
                this.errorMessage = 'Please check all fields again';
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
    return this.first_name &&
      this.last_name &&
      this.password &&
      this.phone &&
      this.email &&
      this.confirmPassword && this.province &&
      this.district &&
      this.ward
      ? true
      : false;
  }
  getProvince() {
    this._cart.getProvinces().subscribe(
      (data: any) => {
        console.log('Province : ', data.data);
        this.provinces = data.data;
      },
      (error) => { }
    );
  }
  onProvinceChange() {
    this.province = this.selectedProvince;
    this._cart.getCities(parseInt(this.selectedProvince)).subscribe(
      (data: any) => {
        console.log('City : ', data.data);
        this.cities = data.data;
      },
      (error) => { }
    );
  }
  onCityChange() {
    this.district = this.selectedCity;
    this._cart.getWard(parseInt(this.selectedCity)).subscribe(
      (data: any) => {
        console.log('Ward : ', data.data);
        this.wards = data.data;
      },
      (error) => { }
    );
  }

  onWardChange() {
    this.ward = this.selectedWard;
    // console.log(this.selectedWard)
  }
}
