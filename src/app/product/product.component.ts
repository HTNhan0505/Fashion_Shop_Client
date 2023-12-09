import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { map } from 'rxjs/operators';


import { CartService } from '../services/cart.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  id: number;
  product: any;
  quantity: number;
  showcaseImages: any[] = [];
  loading = false;
  imgs: any;
  imgBtns: any

  constructor(
    private _route: ActivatedRoute,
    private _product: ProductService,
    private _cart: CartService,
    private _notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.imgs = document.querySelectorAll('.img-select a');
    this.imgBtns = [...this.imgs];



    this.loading = true;
    this.getSingleProduct()
  }

  changeSlide(id: any) {
    const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;
    document.querySelector<HTMLElement>('.img-showcase').style.transform = `translateX(${- (id - 1) * displayWidth}px)`;
  }

  getSingleProduct() {
    this._route.paramMap
      .pipe(
        map((param: any) => {
          return param.params.id;
        })
      )
      .subscribe((productId) => {
        this._product.getSingleProduct(productId).subscribe((product) => {
          this.product = product;
          this.showcaseImages = product.listImage
          if (product.quantity === 0) this.quantity = 0;
          else this.quantity = 1;

          this.loading = false;
        });
      });
  }
  addToCart(): void {
    console.log(this.product)
    this._cart.addProduct({
      productID: this.product.productId,
      price: this.product.price,
      itemQuantity: this.quantity,
      listImage: this.product.listImage,
      productName: this.product.productName,
    }).subscribe(
      response => {
        // Xử lý phản hồi từ API (nếu cần)
        this._notification.create(
          'success',
          'Product added to cart',
          `${this.product.productName} was successfully added to the cart`,
          { nzPlacement: 'bottomLeft' }
        );
        // console.log('Add to cart successful');
      },
      error => {
        // Xử lý lỗi (nếu có)
        console.error('Add to cart failed', error);
      }
    );;
  }
}
