export interface Product {
  Name: string;
  Price: number;
  PriceDiscounted: number;
  Description: string;
  ImagesURL: string[];
  Tags: string[];
  Status: string;
}

export interface ProductsResponse {
  data: Product[];
  status: string;
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  next_page: number;
  prev_page: number;
}