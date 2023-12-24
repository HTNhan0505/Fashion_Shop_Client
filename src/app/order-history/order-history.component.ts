import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  listOfData: any[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
  user: any;
  orders: any[] = [];
  error = '';
  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _product: ProductService
  ) {
    this.user = this._auth.getUser();
  }

  ngOnInit(): void {
    this.getOrder()
  }
  getOrder() {
    this._api.getTypeRequest('users/orders').subscribe(
      (res: any) => {
        console.log(res);
        this.orders = res.data
      },
      (err) => {
        this.error = err.error.message;
      }
    );
  }

  cancelOrder(id: any, status: any) {
    this._api.putTypeRequest('users/orders/cancel/' + id, null).subscribe((res) => {
      console.log('Order canceled successfully');
    }, (error) => {
      console.error('Failed to cancel order:', error);
    })
    this.getOrder()
    // console.log(id)
  }
}
