import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartData = {
    products: [],
    total: 0,
  };

  cartDataObs$ = new BehaviorSubject(this.cartData);

  constructor(
    private _notification: NzNotificationService,
    private _api: ApiService,
    private http: HttpClient
  ) {
    let localCartData = JSON.parse(localStorage.getItem('cart'));
    if (localCartData) this.cartData = localCartData;

    this.cartDataObs$.next(this.cartData);
  }

  submitCheckout(userId, cart) {
    return this._api.postTypeRequest('orders/create', {
      userId: userId,
      cart: cart,
    });
  }

  addProduct(params: any): Observable<any> {
    // const { productID, price, itemQuantity, listImage, productName } = params;
    // const product = { productID, price, itemQuantity, listImage, productName };

    // this.cartData.products.push(product)

    // this.cartData.total = this.getCartTotal();

    // this.cartDataObs$.next({ ...this.cartData });
    // localStorage.setItem('cart', JSON.stringify(this.cartData));

    return this._api.postTypeRequest('users/cart/add', {
      productID: params.productID,
      price: params.price,
      itemQuantity: params.itemQuantity,
      listImage: params.listImage,
      productName: params.productName,
    });
  }

  updateCart(id: number, quantity: number): void {
    // copy array, find item index and update
    let updatedProducts = [...this.cartData.products];
    let productIndex = updatedProducts.findIndex((prod) => prod.id == id);

    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      quantity: quantity,
    };

    this.cartData.products = updatedProducts;
    this.cartData.total = this.getCartTotal();
    this.cartDataObs$.next({ ...this.cartData });
    console.log(this.cartData.products);
    localStorage.setItem('cart', JSON.stringify(this.cartData));
  }

  removeProduct(id: number): void {
    let updatedProducts = this.cartData.products.filter(
      (prod) => prod.id !== id
    );
    this.cartData.products = updatedProducts;
    this.cartData.total = this.getCartTotal();
    this.cartDataObs$.next({ ...this.cartData });
    localStorage.setItem('cart', JSON.stringify(this.cartData));

    this._notification.create(
      'success',
      'Removed successfully',
      'The selected item was removed from the cart successfully',
      { nzPlacement: 'bottomLeft' }
    );
  }

  clearCart(): void {
    this.cartData = {
      products: [],
      total: 0,
    };
    this.cartDataObs$.next({ ...this.cartData });
    localStorage.setItem('cart', JSON.stringify(this.cartData));
  }

  getCartTotal(): number {
    let totalSum = 0;
    this.cartData.products.forEach(
      (prod) => (totalSum += prod.price * prod.quantity)
    );

    return totalSum;
  }

  isProductInCart(id: number): boolean {
    return true
    // return this.cartData.products.findIndex((prod) => prod.id === id) !== -1;
  }
}
