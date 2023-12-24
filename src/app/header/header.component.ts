import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
    this.getCart()


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

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  removeProductFromCart(id: number) {
    this._cart.removeProduct(id);
  }

  logout() {
    this._auth.logout();
    this.isMenuOpen = false;
  }


  searchData() {
    if (this.keyWord) {
      this._router.navigate([`product-category/${this.keyWord}`]);
    } else {
      this._router.navigate(['/']);

    }
    // this._prod.searchProducts(0, 5, this.keyWord).subscribe((response: any) => {
    //   console.log(response)
    // });
  }
}
