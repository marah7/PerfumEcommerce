// cart.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Array<any> = [];


  constructor() { }

  getCartItems() {
    return this.cartItems;
  }

  addToCart(product: any) {
    this.cartItems.push(product);
  }
}

