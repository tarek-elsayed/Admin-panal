import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories: any[] = [];
  categoriesList: any[] = [];
  categoryForm: FormGroup;
  selectedCategory: any = null;
  editingCategoryId: number | null = null;

  constructor(private categoryService: CategoryService, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
      // arrow function save context when calling 
       this.categories.filter((item,index) => {
        this.categoriesList.push({
          id: index + 1,
          name: item,
        });
      })

    });
  }

  onEdit(category: any): void {
    debugger
    this.selectedCategory = category;
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue(category);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      debugger
      if (this.editingCategoryId) {
        // Edit existing category
        this.categoryService.updateCategory(this.editingCategoryId, categoryData).subscribe(() => {
          this.resetForm();
          this.loadCategories();
        });
      } else {
        // Add new category
        this.categoryService.createCategory(categoryData).subscribe(() => {
          this.resetForm();
          this.loadCategories();
        });
      }
    }
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.selectedCategory = null;
    this.editingCategoryId = null;
  }
}

