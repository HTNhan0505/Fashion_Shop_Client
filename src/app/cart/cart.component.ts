import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ShareService } from '../services/share.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartData: any;
  total: any;
  totalAmount: any;
  oldPriceSingleProduct = []
  products: any;
  constructor(private _cart: CartService, private _notification: NzNotificationService, private _share: ShareService) {
    this._cart.cartDataObs$.subscribe((cartData) => {
      this.cartData = cartData;

    });
  }

  ngOnInit(): void {
    this.getCart()
  }

  updateCart(id: string, quantity: any): void {
    if (quantity == "" || quantity == 0) {
      this._notification.create(
        'error',
        'Update fail',
        'Quantity is not blank or equal zero',
        { nzPlacement: 'bottomLeft' }
      );
    } else {
      this._cart.updateCart(id, quantity).subscribe(
        (res: any) => {
          console.log("update cart", res)
          this.getCart()
        },
        (err) => {

        }
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
        this.getCart()
        this._share.sendClickEvent();
      },

    });;

  }
  // Get product from cart
  getCart() {
    this._cart.getTotalCart().subscribe(
      (res: any) => {
        if (!res.total) {
          this.total = 0
          this.totalAmount = res.total_price
        } else {
          this.total = res.total
          this.products = res.data
          this.totalAmount = res.total_price
          this._share.sendClickEvent();
        }

      },
      (err) => {

      }
    )
  }
}
