import { Component, OnInit, Input } from '@angular/core';
import { CartService } from '../services/cart.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ShareService } from '../services/share.service';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() title: string;
  @Input() image: string[];
  @Input() short_desc: string;
  @Input() category: string;
  @Input() quantity: number;
  @Input() price: string;
  @Input() id: any;
  @Input() onAdd: any;

  constructor(
    private _cart: CartService,
    private _notification: NzNotificationService,
    private _share: ShareService
  ) { }

  ngOnInit(): void { }

  addToCart(): void {
    this._cart
      .addProduct({
        productID: this.id,
        price: this.price,
        itemQuantity: 1,
        listImage: this.image,
        productName: this.title,
        quantity: this.quantity
      })
      .subscribe(
        (response) => {
          // Xử lý phản hồi từ API (nếu cần)
          this._notification.create(
            'success',
            'Product added to cart',
            `${this.title} was successfully added to the cart`,
            { nzPlacement: 'bottomLeft' }
          );
          this._share.sendClickEvent();
          // console.log('Add to cart successful');
        },
        (error) => {
          // Xử lý lỗi (nếu có)
          console.error('Add to cart failed', error);
        }
      );
  }
}
