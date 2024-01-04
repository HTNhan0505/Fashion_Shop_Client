import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { Products, Product } from '../shared/models/product.model';
import { TokenStorageService } from '../services/token-storage.service';
import { ShareService } from '../services/share.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: any[] = [
  ];
  banner: any[] = [
    {
      title: 'Áo Khoác Len Dáng Ngắn',
      detail: 'Một thiết kế đầy tinh tế trong chất liệu len.',
      imgsource: "https://im.uniqlo.com/global-cms/spa/res1527efa3ca5f9f51def901218d8b10fdfr.jpg"
    },
    {
      title: 'Áo Len Dệt 3D Cổ Tròn Dài Tay',
      detail: 'Thêm điểm nhấn cho phong cách của bạn.',
      imgsource: "https://hips.hearstapps.com/hmg-prod/images/anna-rosa-vitiello-wears-white-and-orange-sunglasses-gold-news-photo-1672741379.jpg"
    },
    {
      title: 'Quần Nỉ Túi Hộp (Cargo)',
      detail: 'Quần nỉ với điểm nhấn là túi hộp',
      imgsource: "https://tamanh.net/wp-content/uploads/2022/10/phong-cach-high-fashion-la-gi-copy.jpg"
    },
    {
      title: 'Quần Jeans Dáng Relax Dài Đến Mắt Cá',
      detail: 'Mềm và thoải mái. Thiết kế kiểu dáng đẹp mắt.',
      imgsource: "https://media.glamour.com/photos/63a235d04dd4cb9b8e66e522/16:9/w_2992,h_1683,c_limit/trends.png"
    },
  ]
  loading = false;
  pageNumber = 0;
  pageSize = 4;
  total = 0
  productPageCounter = 1;
  additionalLoading = false;
  slideIndex: number

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private _token: TokenStorageService,
    private _cart: CartService,
    private _share: ShareService,
    private _router: Router,
  ) {

  }

  public screenWidth: any;
  public screenHeight: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }


  ngOnInit(): void {
    this.slideIndex = 0
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.loading = true;
    this.getProduct()


    setTimeout(() => {
      this.productService.getCategoryList().subscribe(
        (res: any) => {
          // console.log(res.data)
          this.categories = res.data
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    }, 500);
    this.changeSlide()
    this._share.sendClickEvent();
  }
  // Lấy product theo offset và limit
  getProduct() {
    this.productService.getProductList(this.pageNumber, this.pageSize).subscribe(
      (res: any) => {
        this.products = [...this.products, ...res.data];
        this.additionalLoading = false;
        this.total = Math.ceil(res.total / this.pageSize)
      },
      (err) => {
        this.additionalLoading = false;
      }
    );

  }

  // Hàm này handle cho nút show more sẽ tăng offset thêm 1
  showMoreProducts(): void {
    this.additionalLoading = true;
    this.pageNumber++;
    this.getProduct()
  }

  // Render slide cho banner

  nextSlide() {
    if (this.slideIndex + 1 > this.banner.length - 1) {
      this.slideIndex = 0
    } else {
      this.slideIndex = this.slideIndex + 1
    }
  }
  prevSlide() {
    if (this.slideIndex - 1 < 0) {
      this.slideIndex = this.banner.length - 1
    } else {
      this.slideIndex = this.slideIndex - 1
    }
  }
  // Test setInterVal
  changeSlide() {
    setInterval(() => {
      if (this.slideIndex + 1 > this.banner.length - 1) {
        this.slideIndex = 0
      } else {
        this.slideIndex = this.slideIndex + 1
      }
    }, 3000);
  }
  // loadProduct
  loadProduct() {
    // console.log("")
  }
  handleGetProductByCategory(id: any) {
    this._router.navigate([`category/${id}`]);
  }
}
