import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  isDisabled: boolean = false;
  constructor(
    private _product: ProductService,
    private _activeRoute: ActivatedRoute,
    private _auth: AuthService
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
      console.log(result.data);
      console.log(result.data[0].Items);
    });
  }
}
