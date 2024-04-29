import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-single-history',
  templateUrl: './single-history.component.html',
  styleUrls: ['./single-history.component.scss'],
})
export class SingleHistoryComponent implements OnInit {
  user: any;
  orders: any[] = [];
  error = '';
  total: any
  isRated: boolean;
  statusOrder: any
  constructor(
    private _product: ProductService,
    private _activeRoute: ActivatedRoute,
    private _auth: AuthService,
    public _dialog: DialogService
  ) {
    this.user = this._auth.getUser();
  }

  ngOnInit(): void {
    this.getSingleOrder(this._activeRoute.snapshot.paramMap.get('query'));
  }
  getSingleOrder(id: any) {
    this._product.getSingleOrder(id).subscribe((result) => {
      this.orders = result.data[0].Items
      this.total = result.data[0].price
      this.statusOrder = result.data[0].status
    });
  }
  openDialog(id: any) {
    this._dialog.showDialogFeedback = true
    this._dialog.idProductFeedback = id
  }
}
