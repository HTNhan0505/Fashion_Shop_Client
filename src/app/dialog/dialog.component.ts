import { Component, OnInit } from '@angular/core';
import { DialogService } from '../services/dialog.service';
import { ShareService } from '../services/share.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  rating: number;
  reviewText: string;
  constructor(public _dialog: DialogService, private _notification: NzNotificationService,
    private _share: ShareService,) { }

  ngOnInit(): void {

  }
  updateRating(rating: number) {
    this.rating = rating;
  }
  sendFeedback() {
    if (!this.rating || !this.reviewText) {
      this._notification.create(
        'error',
        'Failed to send review product',
        `The score or content review must not be empty.`,
        { nzPlacement: 'bottomLeft' }
      );
      this._share.sendClickEvent();
    } else {
      const contentFb = {
        content: this.reviewText,
        rating: this.rating,
      }
      this._dialog.sendFeedback(contentFb).subscribe(
        (result) => {
          this._dialog.showDialogFeedback = false
          this._notification.create(
            'success',
            'Success to send review product',
            `Thank for your review our product`,
            { nzPlacement: 'bottomLeft' }
          );
          this._share.sendClickEvent();
        }
      )
    }
  }
}
