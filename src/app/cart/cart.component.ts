import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartData: any;
  total: any;
  products: any;
  constructor(private _cart: CartService, private _notification: NzNotificationService) {
    this._cart.cartDataObs$.subscribe((cartData) => {
      this.cartData = cartData;
      // console.log(cartData);
    });
  }

  ngOnInit(): void {
    this.getCart()
  }

  updateCart(id: number, quantity: number): void {
    console.log({ id, quantity });
    this._cart.updateCart(id, quantity);
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
      },
      error: console.log,
    });;

  }
  // Get product from cart
  getCart() {
    this._cart.getTotalCart().subscribe(
      (res: any) => {
        if (!res.total) {
          this.total = 0
        } else {
          this.total = res.total
          this.products = res.data
        }
        console.log("data", res)
      },
      (err) => {
        console.log(err)
      }
    )
  }
}
