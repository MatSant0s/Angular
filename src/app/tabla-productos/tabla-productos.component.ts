import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../services/product.service';
import { Producto } from '../model/product.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productService.getProductos().subscribe((data: Producto[]) => {
      this.productos = data;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        this.mostrarModal = url.includes('/productos/nuevo');
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
    this.router.navigate(['/productos/nuevo']);
  }

  cerrarModal() {
    this.router.navigate(['/productos']);
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

  onFechaLiberacionChange(event: any) {
    const fecha = new Date(event.target.value);
    if (!isNaN(fecha.getTime())) {
      const reestructuracion = new Date(fecha);
      reestructuracion.setFullYear(reestructuracion.getFullYear() + 1);
      this.nuevoProducto.fechaReestructuracion = reestructuracion.toISOString().split('T')[0];
    }
  }

  validarProducto(): boolean {
    this.errores = [];

    if (!this.nuevoProducto.id) {
      this.errores.push('El ID es requerido.');
    } else if (this.nuevoProducto.id.length < 3 || this.nuevoProducto.id.length > 10) {
      this.errores.push('El ID debe tener entre 3 y 10 caracteres.');
    } else if (this.productos.some(p => p.id.toString() === this.nuevoProducto.id.toString())) {
      this.errores.push('El ID ya existe.');
    }

    if (!this.nuevoProducto.nombre || this.nuevoProducto.nombre.length < 5 || this.nuevoProducto.nombre.length > 100) {
      this.errores.push('El nombre debe tener entre 5 y 100 caracteres.');
    }

    if (!this.nuevoProducto.descripcion || this.nuevoProducto.descripcion.length < 10 || this.nuevoProducto.descripcion.length > 200) {
      this.errores.push('La descripción debe tener entre 10 y 200 caracteres.');
    }

    if (!this.nuevoProducto.logo) {
      this.errores.push('El logo es requerido.');
    }

    if (!this.nuevoProducto.fechaLiberacion) {
      this.errores.push('La fecha de liberación es requerida.');
    }

    if (!this.nuevoProducto.fechaReestructuracion) {
      this.errores.push('La fecha de reestructuración no se ha calculado correctamente.');
    }

    return this.errores.length === 0;
  }

  enviarProducto() {
    if (this.validarProducto()) {
      this.productService.addProducto(this.nuevoProducto).subscribe(() => {
        this.cerrarModal();
        this.reiniciarFormulario();
        this.ngOnInit();
      });
    }
  }
}
