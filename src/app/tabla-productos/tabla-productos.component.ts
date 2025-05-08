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
  errores: string[] = [];

  nuevoProducto: Producto = {
    id: '',
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
    this.errores = [];
  }

  reiniciarFormulario() {
    this.nuevoProducto = {
      id: '',
      logo: '',
      nombre: '',
      descripcion: '',
      fechaLiberacion: '',
      fechaReestructuracion: ''
    };
    this.errores = [];
  }

  validarProducto(): boolean {
    this.errores = [];

    // Validación ID
    if (!this.nuevoProducto.id) {
      this.errores.push('El ID es requerido.');
    } else if (this.nuevoProducto.id.length < 3 || this.nuevoProducto.id.length > 10) {
      this.errores.push('El ID debe tener entre 3 y 10 caracteres.');
    } else if (this.productos.some(p => p.id.toString() === this.nuevoProducto.id.toString())) {
      this.errores.push('El ID ya existe.');
    }

    // Nombre
    if (!this.nuevoProducto.nombre || this.nuevoProducto.nombre.length < 5 || this.nuevoProducto.nombre.length > 100) {
      this.errores.push('El nombre debe tener entre 5 y 100 caracteres.');
    }

    // Descripción
    if (!this.nuevoProducto.descripcion || this.nuevoProducto.descripcion.length < 10 || this.nuevoProducto.descripcion.length > 200) {
      this.errores.push('La descripción debe tener entre 10 y 200 caracteres.');
    }

    // Logo
    if (!this.nuevoProducto.logo) {
      this.errores.push('El logo es requerido.');
    }

 
    const fechaLib = new Date(this.nuevoProducto.fechaLiberacion);
    const fechaRev = new Date(this.nuevoProducto.fechaReestructuracion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 

    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);  
    manana.setHours(0, 0, 0, 0);  

    const unAnioDespues = new Date(fechaLib);
    unAnioDespues.setFullYear(unAnioDespues.getFullYear() + 1);
    
    fechaRev.setHours(0, 0, 0, 0);

    if (!this.nuevoProducto.fechaLiberacion) {
      this.errores.push('La fecha de liberación es requerida.');
    } else if (fechaLib < manana) {
      this.errores.push('La fecha de liberación debe ser igual o mayor a mañana.');
    }

    if (!this.nuevoProducto.fechaReestructuracion) {
      this.errores.push('La fecha de reestructuración es requerida.');
    } else if (fechaRev.toDateString() !== unAnioDespues.toDateString()) {
      this.errores.push('La fecha de reestructuración debe ser exactamente un año después de la fecha de liberación.');
    }

    return this.errores.length === 0;
  }

  enviarProducto() {
    if (this.validarProducto()) {
      this.productService.addProducto(this.nuevoProducto).subscribe(() => {
        this.mostrarModal = false;
        this.reiniciarFormulario();
        this.ngOnInit();  
      });
    }
  }

  cerrarModal() {
    this.mostrarModal = false;  
  }

}
