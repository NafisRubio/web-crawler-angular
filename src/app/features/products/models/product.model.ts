import {Response} from "../../../core/models/response.model";

export interface Product {
  Name: string;
  Price: number;
  PriceDiscounted: number;
  Description: string;
  ImagesURL: string[];
  Tags: string[];
  Status: string;
}

export interface ProductsResponse extends Response{
  data: Product[];
}
