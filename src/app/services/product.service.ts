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
  private url = environment.apiUrl;
  // private apiUrlAdmin = environment.apiUrlAdmin;
  private apiUrlMain = environment.apiUrlMain;



  constructor(private http: HttpClient, private _api: ApiService) { }

  getAllProducts(limitOfResults = 9, page): Observable<Products> {
    return this.http.get<Products>(this.url + 'products', {
      params: {
        limit: limitOfResults.toString(),
        page: page,
      },
    });
  }

  getProductList(pageNumber: number, pageSize: number): Observable<any> {
    const url = `${this.apiUrlMain}users/product/list?offset=${pageNumber}&limit=${pageSize}`;
    return this.http.get<any>(url);
  }

  getCategoryList(): Observable<any> {
    return this.http.get('http://localhost:3000/admin/getcategory/list');
  }

  getSingleProduct(id: Number): Observable<any> {
    // console.log(id);
    return this._api.getTypeRequest('users/product/' + id);
  }
}