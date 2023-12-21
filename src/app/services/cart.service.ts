import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private token = '5c4242e4-9bf5-11ee-96dc-de6f804954c9'; // Thay thế bằng mã API của bạn


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

  // Add to cart
  addProduct(params: any): Observable<any> {
    const { productID, price, itemQuantity, listImage, productName, quantity } = params;
    const product = { productID, price, itemQuantity, listImage, productName, quantity };

    if (!this.isProductInCart(productID)) {
      if (itemQuantity) this.cartData.products.push(product);
      else this.cartData.products.push({ ...product, quantity: 1 });
    } else {
      let updatedProducts = [...this.cartData.products];
      let productIndex = updatedProducts.findIndex((prod) => prod.productID == productID);
      let product = updatedProducts[productIndex];


      // if no quantity, increment
      if (itemQuantity) {
        updatedProducts[productIndex] = {
          ...product,
          itemQuantity: itemQuantity,
        };
      } else {
        updatedProducts[productIndex] = {
          ...product,
          itemQuantity: product.itemQuantity + 1,
        };
      }


      this.cartData.products = updatedProducts;
    }

    // this.cartData.products.push(product)
    // this.getTotalCart()

    this.cartData.total = this.getCartTotal();

    this.cartDataObs$.next({ ...this.cartData });
    localStorage.setItem('cart', JSON.stringify(this.cartData));

    return this._api.postTypeRequest('users/cart/add', {
      productID: params.productID,
      price: params.price,
      itemQuantity: params.itemQuantity,
      listImage: params.listImage,
      productName: params.productName,
      quantity: params.quantity
    });
  }

  // Get total product form cart
  getTotalCart() {
    return this._api.getTypeRequest('users/cart');
  }

  updateCart(id: string, quantity: number): Observable<any> {
    return this._api.putTypeRequest('users/cart/update', {
      cartItemID: id,
      itemQuantity: quantity
    })

  }

  removeProduct(id: any): Observable<any> {
    return this._api.deleteTypeRequest('users/cart/delete/' + id)
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
    this.getTotalCart().subscribe(
      (res: any) => {
        totalSum = res.total

      },
      (err) => {

      }
    )
    return totalSum;
  }

  isProductInCart(id: number): boolean {
    // return true
    return this.cartData.products.findIndex((prod) => prod.id === id) !== -1;
  }



  getProvinces() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    });

    return this.http.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', { headers });
  }

  getCities(provinceId: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    });

    const body = {
      "province_id": provinceId
    };

    return this.http.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', body, { headers });
  }


  getWard(districtId: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    });

    const body = {
      "district_id": districtId
    };

    return this.http.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', body, { headers });
  }

}
