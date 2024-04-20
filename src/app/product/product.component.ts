import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { map } from 'rxjs/operators';

import { Products, Product } from '../shared/models/product.model';

import { CartService } from '../services/cart.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ShareService } from '../services/share.service';
import { FeedbackService } from '../services/feedback.service';

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
  products: Product[] = [];
  pageNumber = 0;
  pageSize = 4;
  total = 0
  idFeedback: any
  dataFeedback: any
  userFeedback: any

  currentPage = 0;
  totalPages = 0;
  feedbackSize = 5;


  constructor(
    private _route: ActivatedRoute,
    private _product: ProductService,
    private _cart: CartService,
    private _notification: NzNotificationService,
    private _share: ShareService,
    private _feedback: FeedbackService
  ) { }

  ngOnInit(): void {
    this.imgs = document.querySelectorAll('.img-select a');
    this.imgBtns = [...this.imgs];


    this.loading = true;
    this.getSingleProduct()
    this.getProduct()
    this.getFeedback()
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
    this._cart.addProduct({
      productID: this.product.productId,
      price: this.product.price,
      itemQuantity: this.quantity,
      listImage: this.product.listImage,
      productName: this.product.productName,
      quantity: this.product.quantity
    }).subscribe(
      response => {
        // Xử lý phản hồi từ API (nếu cần)
        this._notification.create(
          'success',
          'Product added to cart',
          `${this.product.productName} was successfully added to the cart`,
          { nzPlacement: 'bottomLeft' }
        );
        this._share.sendClickEvent();
        // console.log('Add to cart successful');
      },
      error => {
        // Xử lý lỗi (nếu có)
        console.error('Add to cart failed', error);
      }
    );;
  }
  // Lấy product theo offset và limit
  getProduct() {
    this._product.getProductList(this.pageNumber, this.pageSize).subscribe(
      (res: any) => {
        this.products = [...this.products, ...res.data];
        this.total = Math.ceil(res.total / this.pageSize)
      },
      (err) => {
        // console.log(err);
      }
    );

  }
  // Hàm này handle cho nút show more sẽ tăng offset thêm 1
  showMoreProducts(): void {
    this.pageNumber++;
    this.getProduct()
  }

  getFeedback() {
    this._route.paramMap
      .pipe(
        map((param: any) => {
          return param.params.id;
        })
      )
      .subscribe((productId) => {
        this._feedback.getFeedback(productId, this.currentPage, this.feedbackSize).subscribe((fb) => {
          this.dataFeedback = fb.data
          this.totalPages = Math.ceil(fb.total / this.feedbackSize);
          console.log("Page ", this.totalPages)

          this.loading = false;
        });
      });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getFeedback();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getFeedback();
    }
  }
}
