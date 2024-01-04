import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ShareService } from '../services/share.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartData: any;
  total: any;
  totalAmount: any;
  oldPriceSingleProduct = [];

  province: any;
  district: any;
  ward: any;

  nameProvince: string;
  nameDistrict: string;
  nameWard: string;
  nameLocal: string;

  provinces: any[];
  cities: any[];
  wards: any[];

  cartID: any;

  products: any;
  constructor(
    private _cart: CartService,
    private _notification: NzNotificationService,
    private _share: ShareService,
    private _auth: AuthService,
    private _route: Router
  ) {
    this._cart.cartDataObs$.subscribe((cartData) => {
      this.cartData = cartData;
    });
  }

  ngOnInit(): void {
    this.getCart();
    this.getUser()
  }


  checkoutItem() {
    this._route.navigate(['/order'])
    // this._cart
    //   .submitCheckout(
    //     this.cartID,
    //     this.products,
    //     this.nameLocal,
    //     this.totalAmount,
    //     this.total
    //   )
    //   .subscribe(
    //     (res: any) => {
    //       this._notification.create(
    //         'success',
    //         'successfully',
    //         'Check out successfully',
    //         { nzPlacement: 'bottomLeft' }
    //       );
    //       this.getCart()
    //       this._share.sendClickEvent();
    //     },
    //     (err) => { }
    //   );
  }

  updateCart(id: string, quantity: any): void {
    if (quantity == '' || quantity == 0) {
      this._notification.create(
        'error',
        'Update fail',
        'Quantity is not blank or equal zero',
        { nzPlacement: 'bottomLeft' }
      );
    } else {
      this._cart.updateCart(id, quantity).subscribe(
        (res: any) => {
          this.getCart();
        },
        (err) => { }
      );
    }
  }

  removeCartItem(id: any): void {
    this._cart.removeProduct(id).subscribe({
      next: (res) => {
        this._notification.create(
          'success',
          'Removed successfully',
          'The selected item was removed from the cart successfully',
          { nzPlacement: 'bottomLeft' }
        );
        this.getCart();
        this._share.sendClickEvent();
      },
    });
  }
  // Get product from cart
  getCart() {
    this._cart.getTotalCart().subscribe(
      (res: any) => {
        if (!res.total) {
          this.total = 0;
          this.totalAmount = res.total_price;
        } else {
          this.total = res.total;
          this.products = res.data;
          this.cartID = res.data[0].cartID;

          this.totalAmount = res.total_price;

          this._share.sendClickEvent();
        }
      },
      (err) => { }
    );
  }

  // Get user
  getUser() {
    this._auth.getProfileUser().subscribe(
      (res: any) => {

        this.province = res.province;
        this.district = res.district;
        this.ward = res.ward;


        this.getProvince(res.province, res.district, res.ward)

      },
      (err) => {
      }
    )
  }

  // Get location district , city , ....
  getProvince(id, district, wardCode) {
    this._cart.getProvinces().subscribe(
      (data: any) => {
        this.provinces = data.data;
        for (let prov of this.provinces) {
          if (prov.ProvinceID == id) {


            this.nameProvince = prov.ProvinceName;
          }
        }
        this._cart.getCities(parseInt(id)).subscribe(
          (data: any) => {
            this.cities = data.data;
            for (let city of this.cities) {
              if (city.DistrictID == parseInt(district)) {

                this.nameDistrict = city.DistrictName;
              }
            }

            this._cart.getWard(parseInt(district)).subscribe(
              (data: any) => {
                this.wards = data.data;
                for (let ward of this.wards) {
                  if (ward.WardCode == wardCode) {
                    this.nameWard = ward.WardName;
                  }
                }
                this.nameLocal =
                  this.nameProvince +
                  ', ' +
                  this.nameDistrict +
                  ', ' +
                  this.nameWard;
              },
              (error) => { }
            );

          },
          (error) => { }
        );
      },
      (error) => { }
    );
  }

}
