import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../services/product.service';  // Asegúrate de tener el servicio correcto
import { Producto } from '../model/product.model';

@Component({
  selector: 'app-tabla-productos',
  standalone: true,  // Marca el componente como standalone
  imports: [CommonModule, FormsModule, HttpClientModule],  // Importa los módulos necesarios
  templateUrl: './tabla-productos.component.html',
  styleUrls: ['./tabla-productos.component.css'],
  providers: [ProductService]  // Asegúrate de que el servicio esté disponible
})
export class TablaProductosComponent {
  searchText: string = '';
  registrosPorPagina: number = 5;
  productos: Producto[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProductos().subscribe((data: Producto[]) => {
      this.productos = data.map(p => ({
        ...p,
        fechaLiberacion: new Date(p.fechaLiberacion),
        fechaReestructuracion: new Date(p.fechaReestructuracion)
      }));
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
}
