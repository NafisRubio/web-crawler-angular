import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ProductService} from '../services/product.service';
import {Product} from '../models/product.model';
import {ProductDataSource} from "../datasources/product.datasource";
import {Pagination} from "../../../core/models/response.model";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  pagination: Pagination | null = null;
  error: string | null = null;
  // Domain for the API call - this could be made configurable
  domain = 'attfrench.cross-right.tw';
  // Columns to display in the table
  displayedColumns: string[] = ['name', 'price', 'priceDiscounted', 'status', 'images'];
  private productService = inject(ProductService)
  dataSource: ProductDataSource = new ProductDataSource(this.productService);

  // Convert the observable to a signal
  isLoading = toSignal(this.dataSource.loading$, { initialValue: false });

  ngOnInit(): void {
    this.dataSource.loadProducts(this.domain, 1, 10);
  }

}
