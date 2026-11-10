import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export type EstadoJugador =
  | 'ACTIVO'
  | 'INACTIVO';


export interface JugadorApi {

  id: string;

  nombre: string;

  correo: string;

  telefono: string;

  fechaNacimiento:
    string | null;

  fechaIngreso:
    string;

  estado:
    EstadoJugador;

  usuarioActivo:
    boolean;

  usuarioId:
    string | null;

}


export interface ListaJugadoresResponse {

  ok: boolean;

  total: number;

  jugadores:
    JugadorApi[];

}


export interface JugadorResponse {

  ok: boolean;

  message?: string;

  jugador:
    JugadorApi;

}


export interface CrearJugadorDto {

  nombre: string;

  correo: string;

  password: string;

  telefono: string;

  fechaNacimiento:
    string | null;

  fechaIngreso:
    string;

}


export interface ActualizarJugadorDto {

  nombre: string;

  correo: string;

  telefono: string;

  fechaNacimiento:
    string | null;

  fechaIngreso:
    string;

}


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private readonly http =
    inject(HttpClient);


  private readonly apiUrl =
    'http://localhost:3000/api/jugadores';


  /* ==========================================
     LISTAR
     ========================================== */

  listar():
    Observable<ListaJugadoresResponse> {

    return this.http.get<ListaJugadoresResponse>(
      this.apiUrl
    );

  }


  /* ==========================================
     OBTENER UNO
     ========================================== */

  obtener(
    id: string
  ): Observable<JugadorResponse> {

    return this.http.get<JugadorResponse>(
      `${this.apiUrl}/${id}`
    );

  }


  /* ==========================================
     CREAR
     ========================================== */

  crear(
    datos: CrearJugadorDto
  ): Observable<JugadorResponse> {

    return this.http.post<JugadorResponse>(
      this.apiUrl,
      datos
    );

  }


  /* ==========================================
     ACTUALIZAR
     ========================================== */

  actualizar(
    id: string,
    datos: ActualizarJugadorDto
  ): Observable<JugadorResponse> {

    return this.http.put<JugadorResponse>(
      `${this.apiUrl}/${id}`,
      datos
    );

  }


  /* ==========================================
     ACTIVAR / DESACTIVAR
     ========================================== */

  cambiarEstado(
    id: string,
    estado: EstadoJugador
  ): Observable<JugadorResponse> {

    return this.http.patch<JugadorResponse>(
      `${this.apiUrl}/${id}/estado`,
      {
        estado
      }
    );

  }

}