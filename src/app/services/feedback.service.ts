import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrlMain = environment.apiUrlMain;

  constructor(private http: HttpClient, private _api: ApiService) { }

  getFeedback(id: any, offset: any, fbSize: any) {
    const url = `${this.apiUrlMain}users/rating/${id}?offset=${offset}&limit=${fbSize}`;
    return this.http.get<any>(url);
  }
}
