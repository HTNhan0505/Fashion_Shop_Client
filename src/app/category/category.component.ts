import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Products, Product } from '../shared/models/product.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  products: any = [];
  pageNumber = 0;
  pageSize = 12;
  total = 0;
  loading = false;
  checkProduct = false
  additionalLoading = false;
  constructor(private _product: ProductService, private _activeRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.loading = true;

    this._activeRoute.url.subscribe(url => {
      this.loading = true;
      this.getProductByCategory(url[1].path)
    });
  }

  getProductByCategory(id: any) {
    this._product.getProductByCategory(id, this.pageNumber, this.pageSize).subscribe((result) => {
      if (result.data) {
        this.checkProduct = false
        this.products = result.data;
        this.total = Math.ceil(result.total / this.pageSize)
      } else {
        this.checkProduct = true
        this.products = [];
      }
      this.loading = false
      this.additionalLoading = false;
    });
  }

  // Hàm này handle cho nút show more sẽ tăng offset thêm 1
  showMoreProducts(): void {
    this.additionalLoading = true;
    this.pageNumber++;
    this.getProductByCategory(this._activeRoute.snapshot.paramMap.get('query'))
  }

  previousPage(): void {
    this.loading = true
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.getProductByCategory(this._activeRoute.snapshot.paramMap.get('query'));
    }
  }

  nextPage(): void {
    this.loading = true
    if (this.pageNumber < this.total) {

      this.pageNumber++;
      this.getProductByCategory(this._activeRoute.snapshot.paramMap.get('query'));
    }
  }
}
