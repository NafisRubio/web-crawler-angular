import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../../features/products/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/v1/products';

  constructor(private http: HttpClient) { }

  getProducts(domain: string, page: number = 1, pageSize: number = 10): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('domain', domain)
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }
}