import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Products, Product } from '../shared/models/product.model';


@Component({
  selector: 'app-prod-category',
  templateUrl: './prod-category.component.html',
  styleUrls: ['./prod-category.component.scss']
})
export class ProdCategoryComponent implements OnInit {
  products: undefined | Product[];
  loading = false;
  checkProduct = false

  constructor(private _activeRoute: ActivatedRoute, private _prod: ProductService, private _router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.getProductForSearch(this._activeRoute.snapshot.paramMap.get('query'))

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkProduct = false

        this.loading = true;
        this.getProductForSearch(this._activeRoute.snapshot.paramMap.get('query'))
      }
    });
  }


  getProductForSearch(keyword: string) {
    this._prod.searchProducts(0, 10, keyword).subscribe((result) => {
      if (result.data) {
        this.products = result.data
        this.checkProduct = false
        this.loading = false;

      } else {
        this.products = []
        this.checkProduct = true
        this.loading = false;

      }
      // this.loading = false;
    })

  }
}
