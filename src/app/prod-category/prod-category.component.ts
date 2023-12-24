import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Products, Product } from '../shared/models/product.model';


@Component({
  selector: 'app-prod-category',
  templateUrl: './prod-category.component.html',
  styleUrls: ['./prod-category.component.scss']
})
export class ProdCategoryComponent implements OnInit {
  products: Product[] = [];
  loading = false;

  constructor(private _activeRoute: ActivatedRoute, private _prod: ProductService,) { }

  ngOnInit(): void {
    let query = this._activeRoute.snapshot.paramMap.get('query')
    this.loading = true;
    // console.log(query);
    query && this._prod.searchProducts(0, 10, query).subscribe((result) => {
      this.products = [...this.products, ...result.data];
      this.loading = false;
      // console.log(result)
    })
  }

}
