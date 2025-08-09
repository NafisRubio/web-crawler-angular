import {Component, effect, OnInit, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {Product} from '../models/product.model';
import {ProductDataSource} from "../datasources/product.datasource";
import {toSignal} from "@angular/core/rxjs-interop";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatLabel, MatOption, MatSelect, MatSelectTrigger} from "@angular/material/select";
import {MatFormField} from "@angular/material/form-field";
import {MatListOption, MatSelectionList} from "@angular/material/list";

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
    MatIconModule,
    MatSelectTrigger,
    MatLabel,
    MatFormField,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatSelectionList,
    MatListOption
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  error: string | null = null;
  // Domain for the API call - this could be made configurable
  domain = 'attfrench.cross-right.tw';
  // Pagination settings
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  pageSizeOptions = [5, 10, 25, 50, 100];

  // Convert the observables to signals
  dataSource: ProductDataSource = new ProductDataSource();
  // Dynamic column configuration
  availableColumns = signal<ColumnConfig[]>([
    {key: 'name', header: 'Name', visible: true, type: 'text', width: '200px'},
    {key: 'price', header: 'Price', visible: true, type: 'number', width: '120px'},
    {key: 'priceDiscounted', header: 'Discounted Price', visible: true, type: 'number', width: '150px'},
    {key: 'description', header: 'Description', visible: false, type: 'text', width: '300px'},
    {key: 'status', header: 'Status', visible: true, type: 'text', width: '100px'},
    {key: 'images', header: 'Images', visible: false, type: 'image', width: '120px'},
    {key: 'tags', header: 'Tags', visible: false, type: 'array', width: '200px'}
  ]);
  // Convert the observable to a signal
  isLoading = toSignal(this.dataSource.loading$, {initialValue: false});
  pagination = toSignal(this.dataSource.pagination$, {initialValue: null});


  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor() {
    // Add effect to debug the loading signal
    effect(() => {
      console.debug('isLoading signal changed to:', this.isLoading());
    });
  }

  // Computed property for displayed columns
  get displayedColumns(): string[] {
    return this.availableColumns().filter(col => col.visible).map(col => col.key);
  }

  // Get visible columns
  get visibleColumns(): ColumnConfig[] {
    return this.availableColumns().filter(col => col.visible);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load products with current pagination settings
  loadProducts(): void {
    console.debug('loadProducts called, current isLoading:', this.isLoading());
    return this.dataSource.loadProducts(this.domain, this.currentPage(), this.pageSize());
  }

  // Handle pagination events
  onPageChange(event: PageEvent): void {
    console.debug('onPageChange called, current isLoading:', this.isLoading());
    this.currentPage.set(event.pageIndex + 1); // API uses 1-based indexing
    this.pageSize.set(event.pageSize);
    return this.loadProducts();
  }

  // Toggle column visibility
  toggleColumn(columnKey: string): void {
    const columns = this.availableColumns();
    const updatedColumns = columns.map(col =>
      col.key === columnKey ? {...col, visible: !col.visible} : col
    );
    this.availableColumns.set(updatedColumns);
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