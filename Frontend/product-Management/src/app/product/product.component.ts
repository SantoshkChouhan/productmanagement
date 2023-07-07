import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  newProductName: string='';
  newProductCategoryId!: number;
  editingProductId!: number;
  editProductName!: string;
  editProductCategoryId!: number;

//pagination
  page:number=1;
  count:number=0;
  tableSize:number=10;
  tableSizes:any=[10,20,30,40];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchProducts();
    this.fetchCategories();
  }

  fetchProducts() {
    this.http.get<any[]>('http://localhost:3000/product').subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onPageChange(event:any) {
    this.page=event;
    this.fetchProducts();
     }

  fetchCategories() {
    this.http.get<any[]>('http://localhost:3000/categories').subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(category => category.categoryId === categoryId);
    return category ? category.categoryName : '';
  }

  saveProduct() {
    this.http.post('http://localhost:3000/product', { productName: this.newProductName, categoryId: this.newProductCategoryId }).subscribe(
      () => {
        this.newProductName = '';
        this.newProductCategoryId != null;
        this.fetchProducts();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // editProduct(product: any) {
  //   this.editingProductId = product.productId;
  //   this.editProductName = product.productName;
  //   this.editProductCategoryId = product.categoryId;
  // }
  editProduct(productId: number) {
    this.editingProductId = productId;
    const product = this.products.find(p => p.productId === productId);
    this.editProductName = product.productName;
    this.editProductCategoryId = product.categoryId;
  }
  
 

  updateProduct() {
    this.http.put(`http://localhost:3000/product/${this.editingProductId}`, { productName: this.editProductName, categoryId: this.editProductCategoryId }).subscribe(
      () => {
        this.editingProductId != null;
        this.editProductName = '';
        this.editProductCategoryId != null;
        this.fetchProducts();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  cancelEdit() {
    this.editingProductId != null;
    this.editProductName = '';
    this.editProductCategoryId != null;
  }

  deleteProduct(productId: number) {
    this.http.delete(`http://localhost:3000/product/${productId}`).subscribe(
      () => {
        this.fetchProducts();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}