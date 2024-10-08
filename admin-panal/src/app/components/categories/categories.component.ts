import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  categories: any[] = [];
  searchCategories: any[] = [];
  categoriesList: any[] = [];
  categoryForm!: FormGroup;
  searchForm!: FormGroup;
  selectedCategory: any = null;
  editingCategoryId: number | null = null;
  _unsubscribeAll: Subject<any>;
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.searchForm.valueChanges.subscribe(() => {
      this.onSearch();
    });
  }

  initForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });
  }
  loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.categories = data;
        // arrow function save context when calling
        this.categories.filter((item, index) => {
          this.categoriesList.push({
            id: index + 1,
            name: item,
          });
        });
        this.searchCategories = this.categoriesList;
      });
  }

  onEdit(category: any): void {
    this.selectedCategory = category;
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue(category);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService
        .deleteCategory(id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.loadCategories();
        });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;

      if (this.editingCategoryId) {
        // Edit existing category
        this.categoryService
          .updateCategory(this.editingCategoryId, categoryData)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.resetForm();
            this.loadCategories();
          });
      } else {
        // Add new category
        this.categoryService
          .createCategory(categoryData)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.resetForm();
            this.loadCategories();
          });
      }
    }
  }
  onSearch(): void {
    const searchTerm = this.searchForm.value.searchTerm.toLowerCase();
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].toLowerCase() === searchTerm) {
        this.searchCategories = [];
        this.searchCategories.push({
          id: i + 1,
          name: searchTerm,
        });
        break;
      } else {
        this.searchCategories = this.categoriesList;
      }
    }
  }

  //rest Form
  resetForm(): void {
    this.categoryForm.reset();
    this.selectedCategory = null;
    this.editingCategoryId = null;
  }
  // Clean up method
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
