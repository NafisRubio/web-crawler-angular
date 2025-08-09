import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
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
    // Intentionally do not complete subjects here because the table can be destroyed/created
    // while the data source remains in use (e.g., when toggling loading spinner).
    // Completing them would prevent further emissions (like loading=false) from being received.
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
        }),
        catchError(error => {
          console.error('Error loading products:', error);
          // Provide a safe fallback response
          return of({data: [], status: 'error', pagination: null});
        }),
        finalize(() => {
          console.debug('Finalizing loadProducts: setting loading to false');
          this.loadingSubject.next(false);
        })
      )
      .subscribe({
        next: () => {
          console.debug('Subscribe next - response already processed in tap');
        },
        error: (error) => {
          console.error('Subscribe error:', error);
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