import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  showDialogFeedback = false
  idProductFeedback = ""
  constructor(private _api: ApiService) { }

  sendFeedback(content: any) {
    return this._api.postTypeRequest('users/rating', {
      content: content.content,
      score: content.rating,
      productID: this.idProductFeedback
    })
  }

}
