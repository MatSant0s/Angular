import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaProductosComponent } from './tabla-productos/tabla-productos.component'; 

@Component({
  selector: 'app-root',
  standalone: true,  
  imports: [CommonModule, TablaProductosComponent], 
  template: `<app-tabla-productos></app-tabla-productos>`,  
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {
  title = 'tcs1'
}
