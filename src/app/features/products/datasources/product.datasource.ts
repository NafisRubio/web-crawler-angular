import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, delay} from 'rxjs/operators';
import {Product} from '../models/product.model';
import {ProductService} from '../services/product.service';

export class ProductDataSource implements DataSource<Product> {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private productsService: ProductService) {
  }

  connect(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  disconnect(): void {
    this.productsSubject.complete();
    this.loadingSubject.complete();
  }

  loadProducts(domain: string, page: number, pageSize: number) {
    this.loadingSubject.next(true);

    this.productsService.getProducts(domain, page, pageSize).pipe(
      delay(5000), // Simulate a 5-second delay
      catchError(() => of({data: [], status: 'error', pagination: {}})),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(response => this.productsSubject.next(response.data));
  }
}