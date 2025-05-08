import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../services/product.service';
import { Producto } from '../model/product.model';

@Component({
  selector: 'app-tabla-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './tabla-productos.component.html',
  styleUrls: ['./tabla-productos.component.css'],
  providers: [ProductService]
})
export class TablaProductosComponent implements OnInit {
  searchText: string = '';
  registrosPorPagina: number = 5;
  productos: Producto[] = [];

  mostrarModal: boolean = false;

  nuevoProducto: Producto = {
    id: 0,
    logo: '',
    nombre: '',
    descripcion: '',
    fechaLiberacion: '',
    fechaReestructuracion: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProductos().subscribe((data: Producto[]) => {
      this.productos = data;
    });
  }

  get productosFiltrados() {
    const texto = this.searchText.toLowerCase();
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
    );
  }

  get productosPorPagina() {
    return this.productosFiltrados.slice(0, this.registrosPorPagina);
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  reiniciarFormulario() {
    this.nuevoProducto = {
      id: 0,
      logo: '',
      nombre: '',
      descripcion: '',
      fechaLiberacion: '',
      fechaReestructuracion: ''
    };
  }

  enviarProducto() {
    this.productService.addProducto(this.nuevoProducto).subscribe(() => {
      this.mostrarModal = false;
      this.reiniciarFormulario();
      this.ngOnInit();  // recargar productos
    });
  }
}
