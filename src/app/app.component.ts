import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaProductosComponent } from './tabla-productos/tabla-productos.component';  // Asegúrate de importar el componente de productos

@Component({
  selector: 'app-root',
  standalone: true,  // Marca el componente como standalone
  imports: [CommonModule, TablaProductosComponent],  // Importa el componente de productos y otros módulos que necesites
  template: `<app-tabla-productos></app-tabla-productos>`,  // Usa el componente de tabla en el template
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
