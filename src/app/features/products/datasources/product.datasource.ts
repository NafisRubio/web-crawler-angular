import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {catchError, delay, finalize} from 'rxjs/operators';
import {Product} from '../models/product.model';
import {ProductService} from '../services/product.service';
import {Pagination} from "../../../core/models/response.model";
import {inject} from "@angular/core";

export class ProductDataSource implements DataSource<Product> {
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly paginationSubject = new BehaviorSubject<Pagination | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public pagination$ = this.paginationSubject.asObservable();

  private readonly productsService = inject(ProductService);

  connect(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  disconnect(): void {
    this.productsSubject.complete();
    this.loadingSubject.complete();
    this.paginationSubject.complete();
  }

  loadProducts(domain: string, page: number, pageSize: number) {
    console.debug(`Loading products - Page: ${page}, PageSize: ${pageSize}`);
    this.loadingSubject.next(true);

    this.productsService.getProducts(domain, page, pageSize)
      .pipe(
        tap(response => {
          console.debug('Products response received:', response);
          // Process the response data
          this.productsSubject.next(response.data);
          this.paginationSubject.next(response.pagination);
          // Set loading to false IMMEDIATELY after processing
          console.debug('Setting loading to false after processing response');
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          console.error('Error loading products:', error);
          // Set loading to false on error
          this.loadingSubject.next(false);
          return of({data: [], status: 'error', pagination: null});
        })
      )
      .subscribe({
        next: (response) => {
          console.debug('Subscribe next - response already processed in tap');
        },
        error: (error) => {
          console.error('Subscribe error:', error);
          this.loadingSubject.next(false);
        },
        complete: () => {
          console.debug('Observable completed');
        }
      });
  }

  getPagination(): Pagination | null {
    return this.paginationSubject.value;
  }
}