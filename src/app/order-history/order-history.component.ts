import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  user: any;
  orders: any[] = [];
  error = '';
  isDisabled: boolean = false
  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _product: ProductService,
    private _router: Router,
  ) {
    this.user = this._auth.getUser();
  }

  ngOnInit(): void {
    this.getOrder()
  }
  getOrder() {
    this._api.getTypeRequest('users/orders').subscribe(
      (res: any) => {
        this.orders = res.data
      },
      (err) => {
        this.error = err.error.message;
      }
    );
  }

  cancelOrder(id: any) {
    this._api.putTypeRequest('users/orders/cancel/' + id, null).subscribe((res) => {
      this.isDisabled = true
      console.log('Order canceled successfully');
    }, (error) => {
      console.error('Failed to cancel order:', error);
    })
    this.getOrder()
  }
  handleSingleOrder(id) {
    this._router.navigate([`history/${id}`]);
  }
}
