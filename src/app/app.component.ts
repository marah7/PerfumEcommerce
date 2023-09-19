import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { CartService } from './services/cart.service';
import { Product } from './models/Product.model';
import Fuse from 'fuse.js';

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
  searchTerm: string = '';
  filteredProducts: Product[] = [];
  activeCategory: 'Men' | 'Women' | 'All' = 'All';
  menProducts: Product[] = [];
  womenProducts: Product[] = [];

  fuseOptions: Fuse.IFuseOptions<Product> = {
    keys: ['name'], // Specify the properties to search
    threshold: 0.2, // Adjust the fuzzy search threshold as needed
  };

  // Create a new Fuse instance with your products and options
  fuse: Fuse<Product>;

  // Define a variable to store the currently applied sort order
  sortOrder: 'asc' | 'desc' = 'asc'; // Default sort order

  constructor(private cartService: CartService, private dataService: DataService) {
    // Initialize the Fuse instance with products
    this.fuse = new Fuse(this.products, this.fuseOptions);
  }

  ngOnInit(): void {
    // Fetch products and set categories
    this.dataService.getProducts().subscribe((data: any) => {
      this.products = data.products;
      this.setCategories();
      this.updateFilteredProducts();
    });
  }

  setCategories() {
    // Filter products for Men's and Women's categories
    this.menProducts = this.products.filter(product => product.category === 'Men');
    this.womenProducts = this.products.filter(product => product.category === 'Women');
  }

  setCategory(category: 'Men' | 'Women' | 'All') {
    this.activeCategory = category;
    this.updateFilteredProducts();
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

  updateFilteredProducts() {
    if (this.searchTerm.trim() === '') {
      // No search term provided, filter based on the selected category
      if (this.activeCategory === 'Men') {
        this.filteredProducts = [...this.menProducts];
      } else if (this.activeCategory === 'Women') {
        this.filteredProducts = [...this.womenProducts];
      } else {
        this.filteredProducts = [...this.products]; // Show all products if no category is selected
      }
    } else {
      // Search term is provided, filter based on both search term and category
      const fuseOptions: Fuse.IFuseOptions<Product> = {
        keys: ['name'],
        threshold: 0.1,
      };
      const fuse = new Fuse(this.products, fuseOptions);
      const searchResults = fuse.search(this.searchTerm);

      // Filter the search results by category if a category is selected
      if (this.activeCategory === 'Men') {
        this.filteredProducts = searchResults
          .map(result => result.item)
          .filter(product => product.category === 'Men');
      } else if (this.activeCategory === 'Women') {
        this.filteredProducts = searchResults
          .map(result => result.item)
          .filter(product => product.category === 'Women');
      } else {
        this.filteredProducts = searchResults.map(result => result.item);
      }
    }

    // Sort the filtered products based on the selected sort order
    this.filteredProducts.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }

  // Toggle the sort order between 'asc' and 'desc'
  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.updateFilteredProducts();
  }
}
