export interface Response {
  data: any[];
  status: string;
  message: string;
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