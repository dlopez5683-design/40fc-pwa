import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  MatchService,
  PartidoApi,
  CrearPartidoDto,
  EstadoPartido,
  ConfirmacionPartido
} from '../../../core/services/match.service';


type EstadoConfirmacion =
  | 'Confirmado'
  | 'No asistirá'
  | 'Pendiente';


type TipoMovimiento =
  | 'credito_fondo'
  | 'deuda_fondo';


interface JugadorPartido {
  id: string;
  nombre: string;
  correo: string;
  confirmacion: EstadoConfirmacion;
  asistio: boolean;
}


interface Partido {
  id: string;
  fecha: string;
  hora: string;
  cancha: string;
  costoCancha: number;
  cuotaJugador: number;
  estado:
    | 'Abierta'
    | 'Cerrada'
    | 'Finalizada';
}


interface MovimientoPartido {
  jugadorId: string;
  jugadorNombre: string;
  tipo: TipoMovimiento;
  valorCentavos: number;
  valor: number;
}


interface ResumenCierre {
  asistentes: number;
  noAsistentes: number;
  recaudacion: number;
  costoCancha: number;
  fondoGenerado: number;
  totalCreditos: number;
  totalDeudas: number;
}


@Component({
  selector: 'app-partidos',

  imports: [
    FormsModule
  ],

  templateUrl:
    './partidos.html',

  styleUrl:
    './partidos.scss'
})
export class Partidos
  implements OnInit {


  private readonly matchService =
    inject(MatchService);


  private readonly cdr =
    inject(ChangeDetectorRef);


  mostrarFormulario =
    false;

  cargandoPartidos =
    false;

  guardandoPartido =
    false;

  cambiandoEstado =
    false;

  cambiandoAsistenciaId:
  string | null =
  null;

  mensajeApi =
    '';

  errorApi =
    '';

  mensajeCierre =
    '';

  errorCierre =
    '';


  /*
   * En 19C-3 este valor se persistirá
   * para conservar la rotación exacta
   * entre diferentes fechas.
   */
  indiceRotacionCentavos =
    0;


  hayPartido =
    false;


  partidoActual:
    Partido =
    {
      id: '',
      fecha: '',
      hora: '',
      cancha: '',
      costoCancha: 0,
      cuotaJugador: 2.25,
      estado: 'Abierta'
    };


  formularioPartido = {
    fecha: '',
    hora: '',
    cancha: '',
    costoCancha: 28
  };


  jugadores:
    JugadorPartido[] =
    [];


  movimientosGenerados:
    MovimientoPartido[] =
    [];


  resumenCierre:
    ResumenCierre | null =
    null;


  /* =====================================================
     INICIO
     ===================================================== */

  ngOnInit(): void {

    this.cargarPartidos();

  }


  /* =====================================================
     CARGAR PARTIDOS DESDE MONGODB
     ===================================================== */

  cargarPartidos(): void {

    this.cargandoPartidos =
      true;

    this.errorApi =
      '';


    this.matchService
      .listar()
      .subscribe({

        next:
          respuesta => {

            const partidoMasReciente =
              respuesta.partidos[0];


            if (
              partidoMasReciente
            ) {

              this.cargarPartidoEnPantalla(
                partidoMasReciente
              );

            } else {

              this.hayPartido =
                false;

              this.jugadores =
                [];

            }


            this.cargandoPartidos =
              false;


            this.cdr
              .detectChanges();

          },


        error:
          error => {

            this.cargandoPartidos =
              false;


            this.errorApi =
              this.obtenerMensajeError(
                error,
                'No fue posible cargar los partidos.'
              );


            this.cdr
              .detectChanges();

          }

      });

  }


  /* =====================================================
     CARGAR PARTIDO EN LA PANTALLA
     ===================================================== */

  private cargarPartidoEnPantalla(
    partido:
      PartidoApi
  ): void {

    this.hayPartido =
      true;


    this.partidoActual = {

      id:
        partido.id,

      fecha:
        this.formatearFecha(
          partido.fecha
        ),

      hora:
        partido.hora,

      cancha:
        partido.cancha,

      costoCancha:
        this.centavosADinero(
          partido
            .costoCanchaCentavos
        ),

      cuotaJugador:
        this.centavosADinero(
          partido
            .cuotaJugadorCentavos
        ),

      estado:
        this.mapearEstado(
          partido.estado
        )

    };


    this.jugadores =
      partido.participantes.map(
        participante => ({

          id:
            participante
              .jugadorId
            ??
            '',

          nombre:
            participante.nombre
            ||
            'Jugador',

          correo:
            participante.correo
            ||
            '',

          confirmacion:
            this.mapearConfirmacion(
              participante
                .confirmacion
            ),

          asistio:
            participante.asistio

        })
      );


    /*
     * El cierre financiero todavía es local.
     * En 19C-3 se persistirá.
     */
    this.movimientosGenerados =
      [];

    this.resumenCierre =
      null;

    this.mensajeCierre =
      '';

    this.errorCierre =
      '';

  }


  /* =====================================================
     MAPEO DE ESTADOS
     ===================================================== */

  private mapearEstado(
    estado:
      EstadoPartido
  ): Partido['estado'] {

    switch (
      estado
    ) {

      case 'CERRADA':

        return 'Cerrada';


      case 'FINALIZADA':

        return 'Finalizada';


      default:

        return 'Abierta';

    }

  }


  private mapearConfirmacion(
    confirmacion:
      ConfirmacionPartido
  ): EstadoConfirmacion {

    switch (
      confirmacion
    ) {

      case 'CONFIRMADO':

        return 'Confirmado';


      case 'NO_ASISTIRA':

        return 'No asistirá';


      default:

        return 'Pendiente';

    }

  }


  /* =====================================================
     UTILIDADES
     ===================================================== */

  private formatearFecha(
    fecha:
      string | null
  ): string {

    if (
      !fecha
    ) {

      return '';

    }


    return fecha.substring(
      0,
      10
    );

  }


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


  /* =====================================================
     CONFIRMACIONES
     ===================================================== */

  get totalConfirmados():
    number {

    return this.jugadores.filter(
      jugador =>
        jugador.confirmacion ===
        'Confirmado'
    ).length;

  }


  get totalNoAsistiran():
    number {

    return this.jugadores.filter(
      jugador =>
        jugador.confirmacion ===
        'No asistirá'
    ).length;

  }


  get totalPendientes():
    number {

    return this.jugadores.filter(
      jugador =>
        jugador.confirmacion ===
        'Pendiente'
    ).length;

  }


  /* =====================================================
     ASISTENCIA
     ===================================================== */

  get asistentes():
    JugadorPartido[] {

    return this.jugadores.filter(
      jugador =>
        jugador.asistio
    );

  }


  get noAsistentes():
    JugadorPartido[] {

    return this.jugadores.filter(
      jugador =>
        !jugador.asistio
    );

  }


  get totalAsistentes():
    number {

    return this.asistentes.length;

  }


  /* =====================================================
     CÁLCULOS
     ===================================================== */

  get recaudacion():
    number {

    return (
      this.totalAsistentes
      *
      this.partidoActual
        .cuotaJugador
    );

  }


  get fondoGenerado():
    number {

    return (
      this.recaudacion
      -
      this.partidoActual
        .costoCancha
    );

  }


  get aporteReferencia():
    number {

    if (
      this.totalAsistentes ===
        0
      ||
      this.fondoGenerado <=
        0
    ) {

      return 0;

    }


    return (
      this.fondoGenerado
      /
      this.totalAsistentes
    );

  }


  /* =====================================================
     NUEVO PARTIDO
     ===================================================== */

  abrirNuevoPartido():
    void {

    this.formularioPartido = {
      fecha: '',
      hora: '',
      cancha: '',
      costoCancha: 28
    };


    this.errorApi =
      '';

    this.mensajeApi =
      '';

    this.mostrarFormulario =
      true;

  }


  cancelarFormulario():
    void {

    if (
      this.guardandoPartido
    ) {

      return;

    }


    this.mostrarFormulario =
      false;

  }


  crearPartido():
    void {

    this.errorApi =
      '';

    this.mensajeApi =
      '';


    if (
      !this.formularioPartido.fecha
      ||
      !this.formularioPartido.hora
      ||
      !this.formularioPartido
        .cancha
        .trim()
    ) {

      this.errorApi =
        'Fecha, hora y cancha son obligatorios.';

      return;

    }


    const costoCancha =
      Number(
        this.formularioPartido
          .costoCancha
      );


    if (
      !Number.isFinite(
        costoCancha
      )
      ||
      costoCancha < 0
    ) {

      this.errorApi =
        'El costo de cancha no es válido.';

      return;

    }


    const datos:
      CrearPartidoDto =
      {

        fecha:
          this.formularioPartido
            .fecha,

        hora:
          this.formularioPartido
            .hora,

        cancha:
          this.formularioPartido
            .cancha
            .trim(),

        costoCanchaCentavos:
          this.dineroACentavos(
            costoCancha
          ),

        cuotaJugadorCentavos:
          225

      };


    this.guardandoPartido =
      true;


    this.matchService
      .crear(
        datos
      )
      .subscribe({

        next:
          respuesta => {

            this.guardandoPartido =
              false;

            this.mostrarFormulario =
              false;


            this.mensajeApi =
              respuesta.message
              ??
              'Partido creado correctamente.';


            this.cargarPartidoEnPantalla(
              respuesta.partido
            );


            this.cdr
              .detectChanges();

          },


        error:
          error => {

            this.guardandoPartido =
              false;


            this.errorApi =
              this.obtenerMensajeError(
                error,
                'No fue posible crear el partido.'
              );


            this.cdr
              .detectChanges();

          }

      });

  }


  /* =====================================================
     ASISTENCIA LOCAL
     ===================================================== */

  /* =====================================================
   ASISTENCIA REAL EN MONGODB
   ===================================================== */

cambiarAsistencia(
  jugador:
    JugadorPartido
): void {

  if (
    !this.partidoActual.id
    ||
    !jugador.id
    ||
    this.partidoActual
      .estado ===
      'Finalizada'
    ||
    this.cambiandoAsistenciaId
  ) {

    return;

  }


  this.errorApi =
    '';

  this.mensajeApi =
    '';


  const nuevaAsistencia =
    !jugador.asistio;


  this.cambiandoAsistenciaId =
    jugador.id;


  this.matchService
    .actualizarAsistencia(

      this.partidoActual.id,

      jugador.id,

      nuevaAsistencia

    )
    .subscribe({

      next:
        respuesta => {

          this.cambiandoAsistenciaId =
            null;


          const participanteActualizado =
            respuesta
              .partido
              .participantes
              .find(
                participante =>
                  participante
                    .jugadorId ===
                  jugador.id
              );


          if (
            participanteActualizado
          ) {

            jugador.asistio =
              participanteActualizado
                .asistio;

          }


          this.mensajeApi =
            respuesta.message
            ??
            'Asistencia actualizada correctamente.';


          this.cdr
            .detectChanges();

        },


      error:
        error => {

          this.cambiandoAsistenciaId =
            null;


          this.errorApi =
            this.obtenerMensajeError(
              error,
              'No fue posible actualizar la asistencia.'
            );


          this.cdr
            .detectChanges();

        }

    });

}


  /* =====================================================
     CERRAR CONVOCATORIA
     ===================================================== */

  cerrarConvocatoria():
    void {

    if (
      !this.partidoActual.id
      ||
      this.partidoActual
        .estado ===
      'Finalizada'
      ||
      this.cambiandoEstado
    ) {

      return;

    }


    this.cambiandoEstado =
      true;

    this.errorApi =
      '';

    this.mensajeApi =
      '';


    this.matchService
      .cambiarEstado(
        this.partidoActual.id,
        'CERRADA'
      )
      .subscribe({

        next:
          respuesta => {

            this.cambiandoEstado =
              false;


            this.partidoActual
              .estado =
              'Cerrada';


            this.mensajeApi =
              respuesta.message
              ??
              'Convocatoria cerrada correctamente.';


            this.cdr
              .detectChanges();

          },


        error:
          error => {

            this.cambiandoEstado =
              false;


            this.errorApi =
              this.obtenerMensajeError(
                error,
                'No fue posible cerrar la convocatoria.'
              );


            this.cdr
              .detectChanges();

          }

      });

  }


  /* =====================================================
     REABRIR CONVOCATORIA
     ===================================================== */

  reabrirConvocatoria():
    void {

    if (
      !this.partidoActual.id
      ||
      this.partidoActual
        .estado ===
      'Finalizada'
      ||
      this.cambiandoEstado
    ) {

      return;

    }


    this.cambiandoEstado =
      true;

    this.errorApi =
      '';

    this.mensajeApi =
      '';


    this.matchService
      .cambiarEstado(
        this.partidoActual.id,
        'ABIERTA'
      )
      .subscribe({

        next:
          respuesta => {

            this.cambiandoEstado =
              false;


            this.partidoActual
              .estado =
              'Abierta';


            this.mensajeApi =
              respuesta.message
              ??
              'Convocatoria reabierta correctamente.';


            this.cdr
              .detectChanges();

          },


        error:
          error => {

            this.cambiandoEstado =
              false;


            this.errorApi =
              this.obtenerMensajeError(
                error,
                'No fue posible reabrir la convocatoria.'
              );


            this.cdr
              .detectChanges();

          }

      });

  }


  /* =====================================================
     CENTAVOS
     ===================================================== */

  private dineroACentavos(
    valor:
      number
  ): number {

    return Math.round(
      valor * 100
    );

  }


  private centavosADinero(
    centavos:
      number
  ): number {

    return centavos / 100;

  }


  private distribuirCentavos(
    totalCentavos:
      number,
    cantidadPersonas:
      number,
    desplazamiento:
      number
  ): number[] {

    if (
      cantidadPersonas <=
        0
      ||
      totalCentavos <=
        0
    ) {

      return [];

    }


    const base =
      Math.floor(
        totalCentavos
        /
        cantidadPersonas
      );


    const resto =
      totalCentavos
      %
      cantidadPersonas;


    const resultado =
      new Array(
        cantidadPersonas
      )
        .fill(
          base
        );


    for (
      let i = 0;
      i < resto;
      i++
    ) {

      const posicion =
        (
          desplazamiento
          +
          i
        )
        %
        cantidadPersonas;


      resultado[
        posicion
      ] += 1;

    }


    return resultado;

  }


  /* =====================================================
     CIERRE FINANCIERO LOCAL
     ===================================================== */

  cerrarPartido():
    void {

    this.errorCierre =
      '';

    this.mensajeCierre =
      '';


    if (
      this.partidoActual
        .estado ===
      'Finalizada'
    ) {

      this.errorCierre =
        'Este partido ya fue cerrado financieramente.';

      return;

    }


    if (
      this.totalAsistentes ===
      0
    ) {

      this.errorCierre =
        'No se puede cerrar el partido porque no existen asistentes registrados.';

      return;

    }


    if (
      this.fondoGenerado <
      0
    ) {

      this.errorCierre =
        'La recaudación no cubre todavía el costo de la cancha. No se puede generar el fondo común.';

      return;

    }


    const fondoCentavos =
      this.dineroACentavos(
        this.fondoGenerado
      );


    const creditosCentavos =
      this.distribuirCentavos(
        fondoCentavos,
        this.asistentes.length,
        this.indiceRotacionCentavos
      );


    const aportePromedioExacto =
      fondoCentavos
      /
      this.asistentes.length;


    const deudaTotalCentavos =
      Math.round(
        aportePromedioExacto
        *
        this.noAsistentes.length
      );


    const deudasCentavos =
      this.distribuirCentavos(
        deudaTotalCentavos,
        this.noAsistentes.length,
        this.indiceRotacionCentavos
      );


    const movimientos:
      MovimientoPartido[] =
      [];


    this.asistentes.forEach(
      (
        jugador,
        index
      ) => {

        const centavos =
          creditosCentavos[
            index
          ];


        movimientos.push({

          jugadorId:
            jugador.id,

          jugadorNombre:
            jugador.nombre,

          tipo:
            'credito_fondo',

          valorCentavos:
            centavos,

          valor:
            this.centavosADinero(
              centavos
            )

        });

      }
    );


    this.noAsistentes.forEach(
      (
        jugador,
        index
      ) => {

        const centavos =
          deudasCentavos[
            index
          ];


        movimientos.push({

          jugadorId:
            jugador.id,

          jugadorNombre:
            jugador.nombre,

          tipo:
            'deuda_fondo',

          valorCentavos:
            centavos,

          valor:
            this.centavosADinero(
              centavos
            )

        });

      }
    );


    this.movimientosGenerados =
      movimientos;


    const totalCreditosCentavos =
      creditosCentavos.reduce(
        (
          acumulado,
          valor
        ) =>
          acumulado
          +
          valor,
        0
      );


    const totalDeudasCentavos =
      deudasCentavos.reduce(
        (
          acumulado,
          valor
        ) =>
          acumulado
          +
          valor,
        0
      );


    this.resumenCierre = {

      asistentes:
        this.asistentes.length,

      noAsistentes:
        this.noAsistentes.length,

      recaudacion:
        this.recaudacion,

      costoCancha:
        this.partidoActual
          .costoCancha,

      fondoGenerado:
        this.fondoGenerado,

      totalCreditos:
        this.centavosADinero(
          totalCreditosCentavos
        ),

      totalDeudas:
        this.centavosADinero(
          totalDeudasCentavos
        )

    };


    this.partidoActual.estado =
      'Finalizada';


    if (
      this.jugadores.length >
      0
    ) {

      this.indiceRotacionCentavos =
        (
          this.indiceRotacionCentavos
          +
          1
        )
        %
        this.jugadores.length;

    }


    this.mensajeCierre =
      'Partido cerrado localmente. En 19C-3 estos movimientos se guardarán definitivamente en MongoDB.';


    this.cdr
      .detectChanges();

  }

}