import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../interface/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  products: Product[] = [];
  searchProducts: Product[] = [];
  addEditProducts: Product[] = [];
  productForm!: FormGroup;
  searchForm!: FormGroup;
  selectedProduct: any = null;
  editingProductId: number | null = null;
  _unsubscribeAll: Subject<any>;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.searchForm.valueChanges.subscribe(() => this.onSearch());
  }
  initForm() {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      image: [''],
      category: [''],
    });
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });
  }

  loadProducts(): void {
    this.productService
      .getProducts()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.products = data;
        this.searchProducts = data;
        this.addEditProducts = data;
      });
  }

  onEdit(product: any): void {
    this.selectedProduct = product;
    this.editingProductId = product.id;
    this.productForm.patchValue(product);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService
        .deleteProduct(id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.loadProducts();
        });
    }
  }
  onSearch(): void {
    const searchTerm = this.searchForm.value.searchTerm.toLowerCase();
    this.searchProducts = this.addEditProducts;
    this.searchProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.editingProductId) {
        // Edit existing product
        this.productService
          .updateProduct(this.editingProductId, productData)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((res) => {
            this.EditProduct(res)
            this.resetForm();
            // this.loadProducts();
          });
      } else {
        // Add new product
        this.productService
          .createProduct(productData)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((res) => {
            this.addProduct(res);
            this.resetForm();
            // this.loadProducts();
          });
      }
    }
  }
  EditProduct(product:Product){
    for(let i = 0; i < this.searchProducts.length; i++ ){
      if(product.id == this.searchProducts[i].id ){
        this.searchProducts[i] = product;
      }
    }
  }
  addProduct(product:Product){
    this.searchProducts.push(product);
  }
  // Rest Form
  resetForm(): void {
    this.productForm.reset();
    this.selectedProduct = null;
    this.editingProductId = null;
  }

  // Clean up method
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
