import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  PlayerService,
  JugadorApi,
  CrearJugadorDto,
  ActualizarJugadorDto,
  EstadoJugador
} from '../../../core/services/player.service';


interface Jugador {

  id: string;

  nombre: string;

  correo: string;

  telefono: string;

  fechaNacimiento: string;

  fechaIngreso: string;

  estado: EstadoJugador;

  usuarioActivo: boolean;

  usuarioId: string | null;

}


@Component({
  selector: 'app-jugadores',

  imports: [
    FormsModule
  ],

  templateUrl:
    './jugadores.html',

  styleUrl:
    './jugadores.scss'
})
export class Jugadores
  implements OnInit {


  private readonly playerService =
    inject(PlayerService);
  
  private readonly cdr =
    inject(ChangeDetectorRef);


  busqueda = '';


  mostrarFormulario =
    false;


  editandoId:
    string | null =
    null;


  cargando =
    false;


  guardando =
    false;


  cambiandoEstadoId:
    string | null =
    null;


  mensajeError =
    '';


  mensajeExito =
    '';


  formulario = {

    nombre:
      '',

    correo:
      '',

    password:
      '',

    telefono:
      '',

    fechaNacimiento:
      '',

    fechaIngreso:
      ''

  };


  jugadores:
    Jugador[] =
    [];


  /* =====================================================
     INICIALIZACIÓN
     ===================================================== */

  ngOnInit(): void {

    this.cargarJugadores();

  }


  /* =====================================================
     CARGAR JUGADORES DESDE MONGODB
     ===================================================== */

  cargarJugadores(): void {

    this.cargando =
      true;

    this.mensajeError =
      '';


    this.playerService
      .listar()
      .subscribe({

        next:
  respuesta => {

    this.jugadores =
      respuesta.jugadores.map(
        jugador =>
          this.mapearJugador(
            jugador
          )
      );

    this.cargando =
      false;

    this.cdr.detectChanges();

  },


        error:
          error => {

            this.cargando =
              false;

            this.mensajeError =
              this.obtenerMensajeError(
                error,
                'No fue posible cargar los jugadores.'
              );

            this.cdr.detectChanges();

          }

      });

  }


  /* =====================================================
     CONVERTIR DATOS DE API
     ===================================================== */

  private mapearJugador(
    jugador:
      JugadorApi
  ): Jugador {

    return {

      id:
        jugador.id,

      nombre:
        jugador.nombre,

      correo:
        jugador.correo,

      telefono:
        jugador.telefono ?? '',

      fechaNacimiento:
        this.formatearFecha(
          jugador.fechaNacimiento
        ),

      fechaIngreso:
        this.formatearFecha(
          jugador.fechaIngreso
        ),

      estado:
        jugador.estado,

      usuarioActivo:
        jugador.usuarioActivo,

      usuarioId:
        jugador.usuarioId

    };

  }


  /* =====================================================
     FORMATEAR FECHA
     ===================================================== */

  private formatearFecha(
    fecha:
      string | null
  ): string {

    if (!fecha) {

      return '';

    }


    return fecha
      .substring(
        0,
        10
      );

  }


  /* =====================================================
     FECHA ACTUAL LOCAL
     ===================================================== */

  private obtenerFechaActual():
    string {

    const hoy =
      new Date();


    const anio =
      hoy.getFullYear();


    const mes =
      String(
        hoy.getMonth() + 1
      )
        .padStart(
          2,
          '0'
        );


    const dia =
      String(
        hoy.getDate()
      )
        .padStart(
          2,
          '0'
        );


    return `${anio}-${mes}-${dia}`;

  }


  /* =====================================================
     FILTRAR JUGADORES
     ===================================================== */

  get jugadoresFiltrados():
    Jugador[] {

    const termino =
      this.busqueda
        .trim()
        .toLowerCase();


    if (!termino) {

      return this.jugadores;

    }


    return this.jugadores.filter(
      jugador =>

        jugador.nombre
          .toLowerCase()
          .includes(
            termino
          )

        ||

        jugador.correo
          .toLowerCase()
          .includes(
            termino
          )

    );

  }


  /* =====================================================
     TOTAL ACTIVOS
     ===================================================== */

  get totalActivos():
    number {

    return this.jugadores.filter(
      jugador =>
        jugador.estado ===
        'ACTIVO'
    ).length;

  }


  /* =====================================================
     TOTAL INACTIVOS
     ===================================================== */

  get totalInactivos():
    number {

    return this.jugadores.filter(
      jugador =>
        jugador.estado ===
        'INACTIVO'
    ).length;

  }


  /* =====================================================
     TEXTO ESTADO
     ===================================================== */

  textoEstado(
    estado:
      EstadoJugador
  ): string {

    return estado ===
      'ACTIVO'
      ?
      'Activo'
      :
      'Inactivo';

  }


  /* =====================================================
     ABRIR NUEVO JUGADOR
     ===================================================== */

  abrirNuevoJugador(): void {

    this.editandoId =
      null;


    this.mensajeError =
      '';

    this.mensajeExito =
      '';


    this.formulario = {

      nombre:
        '',

      correo:
        '',

      password:
        '',

      telefono:
        '',

      fechaNacimiento:
        '',

      fechaIngreso:
        this.obtenerFechaActual()

    };


    this.mostrarFormulario =
      true;

  }


  /* =====================================================
     EDITAR JUGADOR
     ===================================================== */

  editarJugador(
    jugador:
      Jugador
  ): void {

    this.editandoId =
      jugador.id;


    this.mensajeError =
      '';

    this.mensajeExito =
      '';


    this.formulario = {

      nombre:
        jugador.nombre,

      correo:
        jugador.correo,

      password:
        '',

      telefono:
        jugador.telefono,

      fechaNacimiento:
        jugador.fechaNacimiento,

      fechaIngreso:
        jugador.fechaIngreso

    };


    this.mostrarFormulario =
      true;

  }


  /* =====================================================
     CANCELAR FORMULARIO
     ===================================================== */

  cancelarFormulario(): void {

    if (
      this.guardando
    ) {

      return;

    }


    this.mostrarFormulario =
      false;


    this.editandoId =
      null;


    this.mensajeError =
      '';

  }


  /* =====================================================
     GUARDAR JUGADOR
     ===================================================== */

  guardarJugador(): void {

    this.mensajeError =
      '';

    this.mensajeExito =
      '';


    const nombre =
      this.formulario.nombre
        .trim();


    const correo =
      this.formulario.correo
        .trim()
        .toLowerCase();


    /* ===================================================
       VALIDACIONES BÁSICAS
       =================================================== */

    if (
      !nombre
      ||
      !correo
    ) {

      this.mensajeError =
        'Nombre y correo electrónico son obligatorios.';

      return;

    }


    if (
      this.editandoId ===
      null
      &&
      !this.formulario.password
    ) {

      this.mensajeError =
        'Debes asignar una contraseña temporal al nuevo jugador.';

      return;

    }


    if (
      this.editandoId ===
      null
      &&
      this.formulario.password.length
        < 8
    ) {

      this.mensajeError =
        'La contraseña temporal debe tener al menos 8 caracteres.';

      return;

    }


    this.guardando =
      true;


    /* ===================================================
       EDITAR JUGADOR EXISTENTE
       =================================================== */

    if (
      this.editandoId !==
      null
    ) {

      const datos:
        ActualizarJugadorDto =
        {

          nombre:
            nombre,

          correo:
            correo,

          telefono:
            this.formulario.telefono
              .trim(),

          fechaNacimiento:
            this.formulario
              .fechaNacimiento
              ||
              null,

          fechaIngreso:
            this.formulario
              .fechaIngreso

        };


      this.playerService
        .actualizar(
          this.editandoId,
          datos
        )
        .subscribe({

          next:
  respuesta => {

    this.guardando =
      false;

    this.mostrarFormulario =
      false;

    this.editandoId =
      null;

    this.mensajeExito =
      respuesta.message
      ??
      'Jugador actualizado correctamente.';

    this.cdr.detectChanges();

    this.cargarJugadores();

  },


          error:
  error => {

    this.guardando =
      false;

    this.mensajeError =
      this.obtenerMensajeError(
        error,
        'No fue posible actualizar el jugador.'
      );

    this.cdr.detectChanges();

  }

        });


      return;

    }


    /* ===================================================
       CREAR NUEVO JUGADOR
       =================================================== */

    const datos:
      CrearJugadorDto =
      {

        nombre:
          nombre,

        correo:
          correo,

        password:
          this.formulario.password,

        telefono:
          this.formulario.telefono
            .trim(),

        fechaNacimiento:
          this.formulario
            .fechaNacimiento
            ||
            null,

        fechaIngreso:
          this.formulario
            .fechaIngreso
            ||
            this.obtenerFechaActual()

      };


    this.playerService
      .crear(
        datos
      )
      .subscribe({

        next:
  respuesta => {

    this.guardando =
      false;

    this.mostrarFormulario =
      false;

    this.editandoId =
      null;

    this.mensajeExito =
      respuesta.message
      ??
      'Jugador creado correctamente.';

    this.cdr.detectChanges();

    this.cargarJugadores();

  },


        error:
  error => {

    this.guardando =
      false;

    this.mensajeError =
      this.obtenerMensajeError(
        error,
        'No fue posible crear el jugador.'
      );

    this.cdr.detectChanges();

  }

      });

  }


  /* =====================================================
     ACTIVAR / DESACTIVAR
     ===================================================== */

  cambiarEstado(
    jugador:
      Jugador
  ): void {

    if (
      this.cambiandoEstadoId
    ) {

      return;

    }


    this.mensajeError =
      '';

    this.mensajeExito =
      '';


    const nuevoEstado:
      EstadoJugador =
      jugador.estado ===
        'ACTIVO'
        ?
        'INACTIVO'
        :
        'ACTIVO';


    this.cambiandoEstadoId =
      jugador.id;


    this.playerService
      .cambiarEstado(
        jugador.id,
        nuevoEstado
      )
      .subscribe({

        next:
          respuesta => {

            this.cambiandoEstadoId =
              null;


            const jugadorActualizado =
              this.mapearJugador(
                respuesta.jugador
              );


            const indice =
              this.jugadores
                .findIndex(
                  item =>
                    item.id ===
                    jugador.id
                );


            if (
              indice !== -1
            ) {

              this.jugadores[
                indice
              ] =
                jugadorActualizado;

            }


            this.mensajeExito =
              respuesta.message
              ??
              'Estado actualizado correctamente.';
              this.cdr.detectChanges();

          },


        error:
          error => {

            this.cambiandoEstadoId =
              null;


            this.mensajeError =
              this.obtenerMensajeError(
                error,
                'No fue posible cambiar el estado del jugador.'
              );
              this.cdr.detectChanges();

          }

      });

  }


  /* =====================================================
     MENSAJES DE ERROR HTTP
     ===================================================== */

  private obtenerMensajeError(
    error:
      HttpErrorResponse,
    mensajePredeterminado:
      string
  ): string {

    return (
      error?.error?.message
      ??
      mensajePredeterminado
    );

  }

}