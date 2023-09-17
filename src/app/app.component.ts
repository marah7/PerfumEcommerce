import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { CartService } from './services/cart.service';
import { Product } from './models/Product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-angular-project';
  products: Product[] = [];
  selectedTab: string = 'home';
  activeTab: string = 'home'; 
  cartItems: Product[] = [];
  isReviewingCheckout = false; 
  cartItemCount: number = 0;
// Define an array to hold cart items

  // Initialize with the 'home' tab as the default active tab
 // Define an array to hold the fetched products

  constructor(private cartService: CartService,private dataService: DataService ) {
    
  }

  ngOnInit(): void {
    // Call the service method to fetch data
    this.dataService.getProducts().subscribe((data: any) => {
      // Assign the fetched products to the component property
      this.products = data.products;
    });
  
  }
  
  addToCart(product: any) {
    console.log(product); 
    this.cartService.addToCart(product);
    this.cartItemCount++; 
    this.updateCartItems(); // Update cart items after adding
  }
  

reviewCheckout() {
    this.isReviewingCheckout = true;
    this.selectedTab = 'checkout';
}


  updateCartItems() {
    this.cartItems = this.cartService.getCartItems();
  }
  removeFromCart(product: Product) {
    const index = this.cartItems.indexOf(product);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
    this.cartItemCount--;
  }
  
  setTab(tabName: string) {
    this.selectedTab = tabName;
  }
  calculateTotal(): number {
    return this.cartItems.reduce((total, cartItem) => total + cartItem.price, 0);
  }
  processPayment() {
    // Implement payment processing logic here
    // You can handle payment and confirm the purchase
    // This function should be called when the user confirms the purchase
    // After successful payment processing, you can reset the cart and navigate to a confirmation page
    console.log('Payment processing logic goes here');
    this.cartItems = []; // Clear the cart after successful payment
    this.isReviewingCheckout = false; // Reset the reviewing flag
  }

  cancelCheckout() {
    // Cancel the checkout and return to the cart
    this.isReviewingCheckout = false;
  }
  
}
