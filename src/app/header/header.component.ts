import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { ShareService } from '../services/share.service';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  updateTotal: Subscription;
  screenHeight: any;
  screenWidth: any;
  isMenuOpen = false;
  isMobile = false;
  isLoggedIn = false;
  dropdownVisible = false;
  keyWord: string
  // cartData: any;
  total: any
  isSubMenuOpen = false;
  isSubMenuMale = false;
  isSubMenuFeMale = false;
  isSubMenuBothGender = false;
  categoriesMale: any[] = [
  ];
  categoriesFemale: any[] = [
  ];
  categories: any[] = [
  ];


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > 768) this.isMobile = false;
    else this.isMobile = true;
  }

  constructor(
    private _token: TokenStorageService,
    private _auth: AuthService,
    private _cart: CartService,
    private _router: Router,
    private _share: ShareService,
    private productService: ProductService,
  ) {
    this.getScreenSize();
    this._auth.user.subscribe((user) => {
      if (user) this.isLoggedIn = true;
      else this.isLoggedIn = false;
    });
    this.updateTotal = this._share.getClickEvent().subscribe(() => {
      this.getCart();
    })


  }

  ngOnInit(): void {
    if (this._token.getUser()) this.isLoggedIn = true;
    else this.isLoggedIn = false;


    this.productService.getCategoryList().subscribe(
      (res: any) => {
        for (let item of res.data) {
          if (item.gender === 'Men') {
            this.categoriesMale.push(item);
          } else if (item.gender === 'Women') {
            this.categoriesFemale.push(item);
          } else {
            this.categories.push(item);
          }
        }
      },
      (err) => {

      }
    );
    this.getCart()
  }

  // Get category
  handleGetProductByCategory(id: any) {
    this._router.navigate([`category/${id}`]);
    this.isMenuOpen = false
  }




  getCart() {
    this._cart.getTotalCart().subscribe(
      (res: any) => {
        if (!res.total) {
          this.total = 0
        } else {
          this.total = res.total
        }
      },
      (err) => {
        this.total = 0
      }
    )
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

  }
  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
  toggleSubMenuMale(gender: any) {
    if (gender == 'Male') {
      this.isSubMenuMale = !this.isSubMenuMale;
    } else if (gender == 'Female') {
      this.isSubMenuFeMale = !this.isSubMenuFeMale;

    } else {
      this.isSubMenuBothGender = !this.isSubMenuBothGender;
    }
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  removeProductFromCart(id: number) {
    this._cart.removeProduct(id);
  }

  logout() {
    this._auth.logout();
    this.isMenuOpen = false;
    this.isSubMenuOpen = false
  }



  searchData() {
    if (this.keyWord) {
      this._router.navigate([`product-category/${this.keyWord}`]);
    } else {
      this._router.navigate(['/']);
    }
  }
}
