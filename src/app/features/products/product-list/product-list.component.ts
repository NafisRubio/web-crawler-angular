import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../core/services/product.service';
import { Product, Pagination } from '../models/product.model';

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
  isLoading = false;
  error: string | null = null;
  
  // Domain for the API call - this could be made configurable
  domain = 'attfrench.cross-right.tw';
  
  // Columns to display in the table
  displayedColumns: string[] = ['name', 'price', 'priceDiscounted', 'status', 'images'];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1, pageSize: number = 10): void {
    this.isLoading = true;
    this.error = null;
    
    this.productService.getProducts(this.domain, page, pageSize)
      .subscribe({
        next: (response) => {
          this.products = response.data;
          this.pagination = response.pagination;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.error = 'Failed to load products. Please try again later.';
          this.isLoading = false;
        }
      });
  }


  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.loadProducts(page, pageSize);
  }
}
