import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],

})
export class CategoryComponent implements OnInit {
  categories: any[]=[];
  newCategoryName: any;
  editingCategoryId!: number;
  editCategoryName!: string;
  editing: boolean = false;
  editCategoryId!: null;

  page:number=1;
  count:number=0;
  tableSize:number=10;
  tableSizes:any=[10,20,30,40];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchCategories();
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

  onPageChange(event:any) {
 this.page=event;
 this.fetchCategories();
  }


  saveCategory() {
    if (!this.newCategoryName) {
      console.error('Category name is required');
      return;
    }

    this.http.post<any[]>('http://localhost:3000/categories', { 
      categoryName: this.newCategoryName 
    }).subscribe(
      () => {
        this.newCategoryName = '';
        this.fetchCategories();
      }
    );
  }

  editCategory(category: any) {
    console.log(category);
    this.editingCategoryId = category.categoryId;
    this.editCategoryName = category.categoryName;
  }

  updateCategory() {
    this.http.put(`http://localhost:3000/categories/${this.editingCategoryId}`, { categoryName: this.editCategoryName }).subscribe(
      () => {
        this.editingCategoryId != null;
        this.editCategoryName = '';
        this.fetchCategories();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  cancelEdit() {
    this.editing = false;
    this.editCategoryId = null;
    this.editCategoryName = '';
  }

  deleteCategory(categoryId: number) {
    this.http.delete(`http://localhost:3000/categories/${categoryId}`).subscribe(
      () => {
        this.fetchCategories();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}