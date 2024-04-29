import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products, Product } from '../shared/models/product.model';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private url = environment.apiUrl;
  // private apiUrlAdmin = environment.apiUrlAdmin;
  private apiUrlMain = environment.apiUrlMain;



  constructor(private http: HttpClient, private _api: ApiService) { }

  // getAllProducts(limitOfResults = 9, page): Observable<Products> {
  //   return this.http.get<Products>(this.url + 'products', {
  //     params: {
  //       limit: limitOfResults.toString(),
  //       page: page,
  //     },
  //   });
  // }

  getProductList(pageNumber: number, pageSize: number): Observable<any> {
    const url = `${this.apiUrlMain}users/product/list?offset=${pageNumber}&limit=${pageSize}`;
    return this.http.get<any>(url);
  }

  getCategoryList(): Observable<any> {
    return this.http.get('http://localhost:3000/users/get-category/list');
  }

  getSingleProduct(id: any): Observable<any> {
    return this._api.getTypeRequest('users/product/' + id);
  }
  searchProducts(pageNumber: number, pageSize: number, keyword: string) {
    const url = `${this.apiUrlMain}users/product?offset=${pageNumber}&limit=${pageSize}&text=${keyword}`;
    return this.http.get<any>(url);
  }
  getSingleOrder(id: any) {
    const url = `${this.apiUrlMain}users/orders/get-single?orderId=${id}`;
    return this.http.get<any>(url);
  }
  getProductByCategory(id: any, pageNumber: number, pageSize: number,) {
    const url = `${this.apiUrlMain}users/product-by-category?categoryId=${id}&offset=${pageNumber}&limit=${pageSize}`;
    return this.http.get<any>(url);
  }

}
