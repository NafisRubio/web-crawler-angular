import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {ProductService} from '../services/product.service';
import {Product} from '../models/product.model';
import {ProductDataSource} from "../datasources/product.datasource";
import {Pagination} from "../../../core/models/response.model";
import {toSignal} from "@angular/core/rxjs-interop";

export interface ColumnConfig {
  key: string;
  header: string;
  visible: boolean;
  type: 'text' | 'number' | 'image' | 'array';
  width?: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  pagination: Pagination | null = null;
  error: string | null = null;
  // Domain for the API call - this could be made configurable
  domain = 'attfrench.cross-right.tw';

  // Dynamic column configuration
  availableColumns = signal<ColumnConfig[]>([
    {key: 'name', header: 'Name', visible: true, type: 'text', width: '200px'},
    {key: 'price', header: 'Price', visible: true, type: 'number', width: '120px'},
    {key: 'priceDiscounted', header: 'Discounted Price', visible: true, type: 'number', width: '150px'},
    {key: 'description', header: 'Description', visible: false, type: 'text', width: '300px'},
    {key: 'status', header: 'Status', visible: true, type: 'text', width: '100px'},
    {key: 'images', header: 'Images', visible: true, type: 'image', width: '120px'},
    {key: 'tags', header: 'Tags', visible: false, type: 'array', width: '200px'}
  ]);
  // Convert the observable to a signal
  private productService = inject(ProductService)
  dataSource: ProductDataSource = new ProductDataSource(this.productService);
  isLoading = toSignal(this.dataSource.loading$, {initialValue: false});

  // Computed property for displayed columns
  get displayedColumns(): string[] {
    return this.availableColumns().filter(col => col.visible).map(col => col.key);
  }

  // Get visible columns
  get visibleColumns(): ColumnConfig[] {
    return this.availableColumns().filter(col => col.visible);
  }

  ngOnInit(): void {
    this.dataSource.loadProducts(this.domain, 1, 10);
  }

  // Toggle column visibility
  toggleColumn(columnKey: string): void {
    const columns = this.availableColumns();
    const updatedColumns = columns.map(col =>
      col.key === columnKey ? {...col, visible: !col.visible} : col
    );
    this.availableColumns.set(updatedColumns);
  }

  // Get column configuration
  getColumnConfig(key: string): ColumnConfig | undefined {
    return this.availableColumns().find(col => col.key === key);
  }

  // Get cell value based on column type
  getCellValue(product: Product, column: ColumnConfig): any {
    switch (column.key) {
      case 'name':
        return product.Name;
      case 'price':
        return product.Price;
      case 'priceDiscounted':
        return product.PriceDiscounted;
      case 'description':
        return product.Description;
      case 'status':
        return product.Status;
      case 'images':
        return product.ImagesURL;
      case 'tags':
        return product.Tags;
      default:
        return '';
    }
  }

  // Format cell value based on type
  formatCellValue(value: any, type: string): string {
    switch (type) {
      case 'number':
        return typeof value === 'number' ? value.toFixed(2) : '0.00';
      case 'array':
        return Array.isArray(value) ? value.join(', ') : '';
      default:
        return value?.toString() || '';
    }
  }

  // Reset columns to default
  resetColumns(): void {
    const defaultColumns = this.availableColumns().map(col => ({
      ...col,
      visible: ['name', 'price', 'priceDiscounted', 'status', 'images'].includes(col.key)
    }));
    this.availableColumns.set(defaultColumns);
  }
}