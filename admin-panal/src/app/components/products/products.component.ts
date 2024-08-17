import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: any[] = [];
  searchProducts: any[] = [];
  productForm!: FormGroup;
  searchForm!: FormGroup;
  selectedProduct: any = null;
  editingProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.searchForm.valueChanges.subscribe(() => this.onSearch());
  }
  initForm(){
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      image: [''],
      category: ['']
    });
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.searchProducts = data;
    });
  }

  onEdit(product: any): void {
    this.selectedProduct = product;
    this.editingProductId = product.id;
    this.productForm.patchValue(product);
  }

  onDelete(id: number): void {
    debugger
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
  onSearch(): void {
    
    const searchTerm = this.searchForm.value.searchTerm.toLowerCase();

    this.searchProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(searchTerm)
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.editingProductId) {
        // Edit existing product
        this.productService.updateProduct(this.editingProductId, productData).subscribe(() => {
          this.resetForm();
          this.loadProducts();
        });
      } else {
        // Add new product
        this.productService.createProduct(productData).subscribe(() => {
          this.resetForm();
          this.loadProducts();
        });
      }
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.selectedProduct = null;
    this.editingProductId = null;
  }

}
