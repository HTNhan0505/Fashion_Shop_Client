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
  loading = false;
  pageNumber = 0;
  pageSize = 5;
  total = 0
  productPageCounter = 1;
  additionalLoading = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private _token: TokenStorageService
  ) { }

  public screenWidth: any;
  public screenHeight: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.loading = true;
    this.getProduct()

    setTimeout(() => {
      this.productService.getCategoryList().subscribe(
        (res: any) => {
          this.categories = res.data
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    }, 500);
  }

  getProduct() {
    this.productService.getProductList(this.pageNumber, this.pageSize).subscribe(
      (res: any) => {
        this.products = [...this.products, ...res.data];
        this.additionalLoading = false;
        this.total = Math.ceil(res.total / this.pageSize)
      },
      (err) => {
        console.log(err);
        this.additionalLoading = false;
      }
    );

  }

  showMoreProducts(): void {
    this.additionalLoading = true;
    this.pageNumber++;
    this.getProduct()
  }
}
