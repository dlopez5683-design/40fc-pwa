import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


export type EstadoPartido =
  | 'ABIERTA'
  | 'CERRADA'
  | 'FINALIZADA';


export type ConfirmacionPartido =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'NO_ASISTIRA';


export interface ParticipantePartidoApi {

  jugadorId:
    string | null;

  nombre:
    string;

  correo:
    string;

  confirmacion:
    ConfirmacionPartido;

  asistio:
    boolean;

}


export interface PartidoApi {

  id:
    string;

  fecha:
    string;

  hora:
    string;

  cancha:
    string;

  costoCanchaCentavos:
    number;

  cuotaJugadorCentavos:
    number;

  estado:
    EstadoPartido;

  participantes:
    ParticipantePartidoApi[];

  creadoPor:
    string | object;

  createdAt:
    string;

  updatedAt:
    string;

}


export interface ListaPartidosResponse {

  ok:
    boolean;

  total:
    number;

  partidos:
    PartidoApi[];

}


export interface MisPartidosResponse
  extends ListaPartidosResponse {

  jugadorId:
    string;

}


export interface PartidoResponse {

  ok:
    boolean;

  message?:
    string;

  partido:
    PartidoApi;

}


export interface CrearPartidoDto {

  fecha:
    string;

  hora:
    string;

  cancha:
    string;

  costoCanchaCentavos:
    number;

  cuotaJugadorCentavos:
    number;

}


export interface ActualizarPartidoDto {

  fecha?:
    string;

  hora?:
    string;

  cancha?:
    string;

  costoCanchaCentavos?:
    number;

}


@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private readonly http =
    inject(HttpClient);


  private readonly apiUrl =
    'http://localhost:3000/api/partidos';


  /* ==========================================
     ADMIN - LISTAR
     ========================================== */

  listar():
    Observable<ListaPartidosResponse> {

    return this.http
      .get<ListaPartidosResponse>(
        this.apiUrl
      );

  }


  /* ==========================================
     ADMIN - OBTENER
     ========================================== */

  obtener(
    id: string
  ): Observable<PartidoResponse> {

    return this.http
      .get<PartidoResponse>(
        `${this.apiUrl}/${id}`
      );

  }


  /* ==========================================
     ADMIN - CREAR
     ========================================== */

  crear(
    datos:
      CrearPartidoDto
  ): Observable<PartidoResponse> {

    return this.http
      .post<PartidoResponse>(
        this.apiUrl,
        datos
      );

  }


  /* ==========================================
     ADMIN - ACTUALIZAR
     ========================================== */

  actualizar(
    id: string,
    datos:
      ActualizarPartidoDto
  ): Observable<PartidoResponse> {

    return this.http
      .put<PartidoResponse>(
        `${this.apiUrl}/${id}`,
        datos
      );

  }


  /* ==========================================
     ADMIN - CERRAR / REABRIR
     ========================================== */

  cambiarEstado(
    id: string,
    estado:
      'ABIERTA' | 'CERRADA'
  ): Observable<PartidoResponse> {

    return this.http
      .patch<PartidoResponse>(
        `${this.apiUrl}/${id}/estado`,
        {
          estado
        }
      );

  }


  /* ==========================================
     ADMIN - ASISTENCIA REAL
     ========================================== */

  actualizarAsistencia(
    partidoId: string,
    jugadorId: string,
    asistio: boolean
  ): Observable<PartidoResponse> {

    return this.http
      .patch<PartidoResponse>(

        `${this.apiUrl}/${partidoId}/participantes/${jugadorId}/asistencia`,

        {
          asistio
        }

      );

  }


  /* ==========================================
     JUGADOR - MIS PARTIDOS
     ========================================== */

  listarMisPartidos():
    Observable<MisPartidosResponse> {

    return this.http
      .get<MisPartidosResponse>(
        `${this.apiUrl}/mios`
      );

  }


  /* ==========================================
     JUGADOR - MI CONFIRMACIÓN
     ========================================== */

  actualizarMiConfirmacion(
    partidoId: string,
    confirmacion:
      'CONFIRMADO'
      |
      'NO_ASISTIRA'
  ): Observable<PartidoResponse> {

    return this.http
      .patch<PartidoResponse>(

        `${this.apiUrl}/${partidoId}/mi-confirmacion`,

        {
          confirmacion
        }

      );

  }

}