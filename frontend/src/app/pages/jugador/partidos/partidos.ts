import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  MatchService,
  PartidoApi,
  ConfirmacionPartido
} from '../../../core/services/match.service';


type RespuestaJugador =
  | 'pendiente'
  | 'confirmado'
  | 'no_asiste';


interface PartidoJugador {

  id:
    string;

  fecha:
    string;

  hora:
    string;

  cancha:
    string;

  costoCancha:
    number;

  cuotaJugador:
    number;

  estado:
    'ABIERTA'
    |
    'CERRADA'
    |
    'FINALIZADA';

  confirmacion:
    RespuestaJugador;

  asistio:
    boolean;

  confirmados:
    number;

}


@Component({
  selector:
    'app-partidos',

  imports: [],

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


  cargando =
    false;


  guardandoRespuesta =
    false;


  mensaje =
    '';


  error =
    '';


  jugadorId =
    '';


  partidoActual:
    PartidoJugador | null =
    null;


  historial:
    PartidoJugador[] =
    [];


  respuesta:
    RespuestaJugador =
    'pendiente';


  /* =====================================================
     INICIO
     ===================================================== */

  ngOnInit(): void {

    this.cargarMisPartidos();

  }


  /* =====================================================
     CARGAR PARTIDOS DEL JUGADOR
     ===================================================== */

  cargarMisPartidos(): void {

    this.cargando =
      true;

    this.error =
      '';


    this.matchService
      .listarMisPartidos()
      .subscribe({

        next:
          respuesta => {

            this.jugadorId =
              respuesta.jugadorId;


            const partidos =
              respuesta.partidos.map(
                partido =>
                  this.mapearPartido(
                    partido
                  )
              );


            this.separarPartidos(
              partidos
            );


            this.cargando =
              false;


            this.cdr
              .detectChanges();

          },


        error:
          error => {

            this.cargando =
              false;


            this.error =
              this.obtenerMensajeError(
                error,
                'No fue posible cargar tus partidos.'
              );


            this.cdr
              .detectChanges();

          }

      });

  }


  /* =====================================================
     MAPEAR PARTIDO
     ===================================================== */

  private mapearPartido(
    partido:
      PartidoApi
  ): PartidoJugador {


    const participante =
      partido.participantes.find(
        item =>
          item.jugadorId ===
          this.jugadorId
      );


    /*
     * Durante el primer mapeo jugadorId puede
     * haberse asignado justo antes.
     * Si no encuentra por alguna razón,
     * buscamos también por el único participante
     * correspondiente al usuario autenticado
     * posteriormente mediante buscarParticipante.
     */

    const participanteReal =
      participante
      ??
      this.buscarParticipante(
        partido
      );


    return {

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
        partido
          .costoCanchaCentavos
        /
        100,

      cuotaJugador:
        partido
          .cuotaJugadorCentavos
        /
        100,

      estado:
        partido.estado,

      confirmacion:
        this.mapearConfirmacion(
          participanteReal
            ?.confirmacion
          ??
          'PENDIENTE'
        ),

      asistio:
        participanteReal
          ?.asistio
        ??
        false,

      confirmados:
        partido.participantes.filter(
          item =>
            item.confirmacion ===
            'CONFIRMADO'
        ).length

    };

  }


  /* =====================================================
     BUSCAR PARTICIPANTE
     ===================================================== */

  private buscarParticipante(
    partido:
      PartidoApi
  ) {

    return partido.participantes.find(
      item =>
        item.jugadorId ===
        this.jugadorId
    );

  }


  /* =====================================================
     SEPARAR ACTUAL E HISTORIAL
     ===================================================== */

  private separarPartidos(
    partidos:
      PartidoJugador[]
  ): void {


    const partidosOrdenados =
      [...partidos].sort(
        (
          a,
          b
        ) =>
          new Date(
            `${b.fecha}T12:00:00`
          ).getTime()
          -
          new Date(
            `${a.fecha}T12:00:00`
          ).getTime()
      );


    const candidatosActuales =
      partidosOrdenados.filter(
        partido =>
          partido.estado !==
          'FINALIZADA'
      );


    /*
     * Si existen varios partidos aún abiertos
     * o cerrados administrativamente,
     * elegimos el más próximo a partir de hoy.
     */
    const hoy =
      new Date();

    hoy.setHours(
      0,
      0,
      0,
      0
    );


    const futuros =
      candidatosActuales
        .filter(
          partido => {

            const fecha =
              new Date(
                `${partido.fecha}T12:00:00`
              );

            return fecha >= hoy;

          }
        )
        .sort(
          (
            a,
            b
          ) =>
            new Date(
              `${a.fecha}T12:00:00`
            ).getTime()
            -
            new Date(
              `${b.fecha}T12:00:00`
            ).getTime()
        );


    this.partidoActual =
      futuros[0]
      ??
      candidatosActuales[0]
      ??
      null;


    if (
      this.partidoActual
    ) {

      this.respuesta =
        this.partidoActual
          .confirmacion;

    } else {

      this.respuesta =
        'pendiente';

    }


    this.historial =
      partidosOrdenados.filter(
        partido =>
          partido.id !==
          this.partidoActual?.id
      );

  }


  /* =====================================================
     MAPEAR CONFIRMACIÓN
     ===================================================== */

  private mapearConfirmacion(
    confirmacion:
      ConfirmacionPartido
  ): RespuestaJugador {

    switch (
      confirmacion
    ) {

      case 'CONFIRMADO':

        return 'confirmado';


      case 'NO_ASISTIRA':

        return 'no_asiste';


      default:

        return 'pendiente';

    }

  }


  /* =====================================================
     CONFIRMAR ASISTENCIA
     ===================================================== */

  confirmar(): void {

    this.guardarConfirmacion(
      'CONFIRMADO'
    );

  }


  /* =====================================================
     INDICAR QUE NO ASISTE
     ===================================================== */

  noAsistir(): void {

    this.guardarConfirmacion(
      'NO_ASISTIRA'
    );

  }


  /* =====================================================
     GUARDAR CONFIRMACIÓN EN MONGODB
     ===================================================== */

  private guardarConfirmacion(
    confirmacion:
      'CONFIRMADO'
      |
      'NO_ASISTIRA'
  ): void {


    if (
      !this.partidoActual
      ||
      this.partidoActual
        .estado !==
        'ABIERTA'
      ||
      this.guardandoRespuesta
    ) {

      return;

    }


    this.guardandoRespuesta =
      true;

    this.error =
      '';

    this.mensaje =
      '';


    this.matchService
      .actualizarMiConfirmacion(
        this.partidoActual.id,
        confirmacion
      )
      .subscribe({

        next:
          respuesta => {

            this.guardandoRespuesta =
              false;


            const participante =
              respuesta
                .partido
                .participantes
                .find(
                  item =>
                    item.jugadorId ===
                    this.jugadorId
                );


            if (
              participante
            ) {

              this.respuesta =
                this.mapearConfirmacion(
                  participante
                    .confirmacion
                );


              this.partidoActual!
                .confirmacion =
                this.respuesta;


              this.partidoActual!
                .confirmados =
                respuesta
                  .partido
                  .participantes
                  .filter(
                    item =>
                      item.confirmacion ===
                      'CONFIRMADO'
                  )
                  .length;

            }


            this.mensaje =
              respuesta.message
              ??
              'Respuesta actualizada correctamente.';


            this.cdr
              .detectChanges();

          },


        error:
          error => {

            this.guardandoRespuesta =
              false;


            this.error =
              this.obtenerMensajeError(
                error,
                'No fue posible guardar tu respuesta.'
              );


            this.cdr
              .detectChanges();

          }

      });

  }


  /* =====================================================
     FECHAS
     ===================================================== */

  private formatearFecha(
    fecha:
      string
  ): string {

    return fecha.substring(
      0,
      10
    );

  }


  diaSemana(
    fecha:
      string
  ): string {

    const date =
      new Date(
        `${fecha}T12:00:00`
      );


    return date
      .toLocaleDateString(
        'es-EC',
        {
          weekday:
            'long'
        }
      )
      .toUpperCase();

  }


  diaMes(
    fecha:
      string
  ): string {

    const date =
      new Date(
        `${fecha}T12:00:00`
      );


    const dia =
      String(
        date.getDate()
      )
        .padStart(
          2,
          '0'
        );


    const mes =
      date
        .toLocaleDateString(
          'es-EC',
          {
            month:
              'short'
          }
        )
        .replace(
          '.',
          ''
        )
        .toUpperCase();


    return `${dia} ${mes}`;

  }


  diaNumero(
    fecha:
      string
  ): string {

    const date =
      new Date(
        `${fecha}T12:00:00`
      );


    return String(
      date.getDate()
    )
      .padStart(
        2,
        '0'
      );

  }


  mesCorto(
    fecha:
      string
  ): string {

    const date =
      new Date(
        `${fecha}T12:00:00`
      );


    return date
      .toLocaleDateString(
        'es-EC',
        {
          month:
            'short'
        }
      )
      .replace(
        '.',
        ''
      )
      .toUpperCase();

  }


  textoEstadoHistorial(
    partido:
      PartidoJugador
  ): string {

    if (
      partido.asistio
    ) {

      return 'Asistió';

    }


    if (
      partido.confirmacion ===
      'no_asiste'
    ) {

      return 'No asistió';

    }


    return 'Sin asistencia registrada';

  }


  /* =====================================================
     ERROR
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