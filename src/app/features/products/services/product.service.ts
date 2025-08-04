import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { ProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = '/api/v1/products';
  private readonly http = inject(HttpClient)

  getProducts(domain: string, page: number = 1, pageSize: number = 10): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('domain_name', domain)
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    console.debug('Making HTTP request with params:', params.toString());

    return this.http.get<ProductsResponse>(this.apiUrl, { params })
      .pipe(
        tap(response => console.debug('HTTP response received:', response))
      );

  }
}