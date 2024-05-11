import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Products, Product } from '../shared/models/product.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  products: Product[] = [];
  pageNumber = 0;
  pageSize = 4;
  total = 0;
  loading = false;
  checkProduct = false
  additionalLoading = false;
  constructor(private _product: ProductService, private _activeRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.loading = true;
    this.getProductByCategory(this._activeRoute.snapshot.paramMap.get('query'))

  }

  getProductByCategory(id: any) {
    this._product.getProductByCategory(id, this.pageNumber, this.pageSize).subscribe((result) => {
      if (result.data) {
        this.products = [...this.products, ...result.data];
        this.total = Math.ceil(result.total / this.pageSize)
      } else {
        this.checkProduct = true
      }
      this.loading = false
    });
  }

  // Hàm này handle cho nút show more sẽ tăng offset thêm 1
  showMoreProducts(): void {
    this.additionalLoading = true;
    this.pageNumber++;
    this.getProductByCategory(this._activeRoute.snapshot.paramMap.get('query'))
  }
}
