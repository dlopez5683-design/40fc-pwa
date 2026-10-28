import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TipoActividad =
  | 'Periodica'
  | 'Evento'
  | 'Extraordinaria';

type EstadoActividad =
  | 'Activa'
  | 'Cerrada';

interface ParticipanteActividad {
  jugadorId: number;
  nombre: string;
  pagado: number;
}

interface Actividad {
  id: number;
  nombre: string;
  tipo: TipoActividad;
  descripcion: string;
  valorPorMiembro: number;
  fechaLimite: string;
  estado: EstadoActividad;
  participantes: ParticipanteActividad[];
}

@Component({
  selector: 'app-actividades',
  imports: [FormsModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.scss'
})
export class Actividades {

  busqueda = '';

  mostrarFormulario = false;

  editandoId: number | null = null;

  actividadDetalle: Actividad | null = null;


  /*
   * Jugadores provisionales.
   * Más adelante vendrán desde MongoDB.
   */
  jugadoresBase = [
    {
      id: 1,
      nombre: 'Irving'
    },
    {
      id: 2,
      nombre: 'Eduardo'
    },
    {
      id: 3,
      nombre: 'Víctor Párraga'
    },
    {
      id: 4,
      nombre: 'Robinson'
    }
  ];


  formulario = {
    nombre: '',
    tipo: 'Evento' as TipoActividad,
    descripcion: '',
    valorPorMiembro: 0,
    fechaLimite: ''
  };


  actividades: Actividad[] = [

    {
      id: 1,

      nombre: 'Cumpleaños',

      tipo: 'Periodica',

      descripcion:
        'Aporte destinado a las actividades de cumpleaños de los miembros del club.',

      valorPorMiembro: 10,

      fechaLimite: '2026-12-31',

      estado: 'Activa',

      participantes: [
        {
          jugadorId: 1,
          nombre: 'Irving',
          pagado: 10
        },
        {
          jugadorId: 2,
          nombre: 'Eduardo',
          pagado: 10
        },
        {
          jugadorId: 3,
          nombre: 'Víctor Párraga',
          pagado: 5
        },
        {
          jugadorId: 4,
          nombre: 'Robinson',
          pagado: 10
        }
      ]
    },

    {
      id: 2,

      nombre: 'Fiesta de Gala 2026',

      tipo: 'Evento',

      descripcion:
        'Actividad de fin de año de los miembros de 40 FC.',

      valorPorMiembro: 40,

      fechaLimite: '2026-12-15',

      estado: 'Activa',

      participantes: [
        {
          jugadorId: 1,
          nombre: 'Irving',
          pagado: 25
        },
        {
          jugadorId: 2,
          nombre: 'Eduardo',
          pagado: 40
        },
        {
          jugadorId: 3,
          nombre: 'Víctor Párraga',
          pagado: 25
        },
        {
          jugadorId: 4,
          nombre: 'Robinson',
          pagado: 20
        }
      ]
    }

  ];


  /* =====================================================
     FILTRO
     ===================================================== */

  get actividadesFiltradas(): Actividad[] {

    const termino =
      this.busqueda
        .trim()
        .toLowerCase();

    if (!termino) {
      return this.actividades;
    }

    return this.actividades.filter(
      actividad =>
        actividad.nombre
          .toLowerCase()
          .includes(termino)
        ||
        actividad.tipo
          .toLowerCase()
          .includes(termino)
    );

  }


  /* =====================================================
     INDICADORES GENERALES
     ===================================================== */

  get totalActividades(): number {

    return this.actividades.length;

  }


  get totalActivas(): number {

    return this.actividades.filter(
      actividad =>
        actividad.estado === 'Activa'
    ).length;

  }


  get totalEsperadoGeneral(): number {

    return this.actividades.reduce(
      (total, actividad) =>
        total +
        this.totalEsperado(actividad),
      0
    );

  }


  get totalRecaudadoGeneral(): number {

    return this.actividades.reduce(
      (total, actividad) =>
        total +
        this.totalRecaudado(actividad),
      0
    );

  }


  get totalPendienteGeneral(): number {

    return Math.max(
      0,
      this.totalEsperadoGeneral -
      this.totalRecaudadoGeneral
    );

  }


  /* =====================================================
     CÁLCULOS POR ACTIVIDAD
     ===================================================== */

  totalEsperado(
    actividad: Actividad
  ): number {

    return (
      actividad.valorPorMiembro *
      actividad.participantes.length
    );

  }


  totalRecaudado(
    actividad: Actividad
  ): number {

    return actividad.participantes.reduce(
      (total, participante) =>
        total + participante.pagado,
      0
    );

  }


  totalPendiente(
    actividad: Actividad
  ): number {

    return Math.max(
      0,
      this.totalEsperado(actividad) -
      this.totalRecaudado(actividad)
    );

  }


  porcentajeRecaudado(
    actividad: Actividad
  ): number {

    const esperado =
      this.totalEsperado(actividad);

    if (esperado <= 0) {
      return 0;
    }

    return Math.min(
      100,
      (
        this.totalRecaudado(actividad) /
        esperado
      ) * 100
    );

  }


  pendienteParticipante(
    actividad: Actividad,
    participante: ParticipanteActividad
  ): number {

    return Math.max(
      0,
      actividad.valorPorMiembro -
      participante.pagado
    );

  }


  /* =====================================================
     NUEVA ACTIVIDAD
     ===================================================== */

  abrirNuevaActividad(): void {

    this.editandoId = null;

    this.formulario = {
      nombre: '',
      tipo: 'Evento',
      descripcion: '',
      valorPorMiembro: 0,
      fechaLimite: ''
    };

    this.mostrarFormulario = true;

  }


  /* =====================================================
     EDITAR
     ===================================================== */

  editarActividad(
    actividad: Actividad
  ): void {

    this.editandoId =
      actividad.id;

    this.formulario = {
      nombre:
        actividad.nombre,

      tipo:
        actividad.tipo,

      descripcion:
        actividad.descripcion,

      valorPorMiembro:
        actividad.valorPorMiembro,

      fechaLimite:
        actividad.fechaLimite
    };

    this.mostrarFormulario = true;

  }


  cancelarFormulario(): void {

    this.mostrarFormulario = false;

    this.editandoId = null;

  }


  /* =====================================================
     GUARDAR
     ===================================================== */

  guardarActividad(): void {

    if (
      !this.formulario.nombre.trim()
      ||
      Number(
        this.formulario.valorPorMiembro
      ) <= 0
    ) {
      return;
    }


    /*
     * EDITAR
     */
    if (
      this.editandoId !== null
    ) {

      const actividad =
        this.actividades.find(
          item =>
            item.id === this.editandoId
        );


      if (actividad) {

        actividad.nombre =
          this.formulario.nombre;

        actividad.tipo =
          this.formulario.tipo;

        actividad.descripcion =
          this.formulario.descripcion;

        actividad.valorPorMiembro =
          Number(
            this.formulario.valorPorMiembro
          );

        actividad.fechaLimite =
          this.formulario.fechaLimite;

      }

    }

    /*
     * CREAR
     */
    else {

      const participantes:
        ParticipanteActividad[] =
        this.jugadoresBase.map(
          jugador => ({
            jugadorId:
              jugador.id,

            nombre:
              jugador.nombre,

            pagado:
              0
          })
        );


      const nuevaActividad:
        Actividad = {

        id:
          Date.now(),

        nombre:
          this.formulario.nombre,

        tipo:
          this.formulario.tipo,

        descripcion:
          this.formulario.descripcion,

        valorPorMiembro:
          Number(
            this.formulario.valorPorMiembro
          ),

        fechaLimite:
          this.formulario.fechaLimite,

        estado:
          'Activa',

        participantes:
          participantes

      };


      this.actividades.unshift(
        nuevaActividad
      );

    }


    this.cancelarFormulario();

  }


  /* =====================================================
     ESTADO
     ===================================================== */

  cambiarEstado(
    actividad: Actividad
  ): void {

    actividad.estado =
      actividad.estado === 'Activa'
        ? 'Cerrada'
        : 'Activa';

  }


  /* =====================================================
     DETALLE
     ===================================================== */

  verDetalle(
    actividad: Actividad
  ): void {

    this.actividadDetalle =
      actividad;

  }


  cerrarDetalle(): void {

    this.actividadDetalle = null;

  }

}