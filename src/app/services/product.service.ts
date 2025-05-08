import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/productos';  // Asegúrate de que este sea el endpoint correcto

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}
