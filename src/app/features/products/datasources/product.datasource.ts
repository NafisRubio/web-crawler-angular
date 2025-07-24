import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, delay, finalize} from 'rxjs/operators';
import {Product} from '../models/product.model';
import {ProductService} from '../services/product.service';
import {Pagination} from "../../../core/models/response.model";
import {inject} from "@angular/core";

export class ProductDataSource implements DataSource<Product> {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private paginationSubject = new BehaviorSubject<Pagination | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public pagination$ = this.paginationSubject.asObservable();

  private productsService = inject(ProductService);

  connect(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  disconnect(): void {
    this.productsSubject.complete();
    this.loadingSubject.complete();
    this.paginationSubject.complete();
  }

  loadProducts(domain: string, page: number, pageSize: number) {
    this.loadingSubject.next(true);

    this.productsService.getProducts(domain, page, pageSize)
      .pipe(
        delay(3000), // Simulate a 5-second delay
        catchError(() => of({data: [], status: 'error', pagination: null})),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(response => {
        this.productsSubject.next(response.data);
        this.paginationSubject.next(response.pagination);
      });
  }

  getPagination(): Pagination | null {
    return this.paginationSubject.value;
  }
}