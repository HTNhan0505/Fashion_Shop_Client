import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private baseUrl = environment.apiUrl;
  private baseUrlMain = environment.apiUrlMain;

  constructor(private _http: HttpClient) { }

  getTypeRequest(url: string) {
    return this._http.get(`${this.baseUrlMain}${url}`).pipe(
      map((res) => {
        return res;
      })
    );
  }
  postTypeRequest(url: string, payload: any) {
    return this._http.post(`${this.baseUrlMain}${url}`, payload).pipe(
      map((res) => {
        return res;
      })
    );
  }
  deleteTypeRequest(url: string) {
    return this._http.delete(`${this.baseUrlMain}${url}`).pipe(
      map((res) => {
        return res;
      })
    );
  }
  putTypeRequest(url: string, payload: any) {
    return this._http.put(`${this.baseUrlMain}${url}`, payload).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
