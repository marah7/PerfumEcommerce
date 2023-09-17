import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  // Define a method to fetch data from the JSON file
  getProducts(): Observable<any> {
    return this.http.get('./assets/product-data.json');
  }
}
