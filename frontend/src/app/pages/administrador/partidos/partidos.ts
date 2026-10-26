import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type EstadoConfirmacion =
  | 'Confirmado'
  | 'No asistirá'
  | 'Pendiente';

type TipoMovimiento =
  | 'credito_fondo'
  | 'deuda_fondo';

interface JugadorPartido {
  id: number;
  nombre: string;
  confirmacion: EstadoConfirmacion;
  asistio: boolean;
}

interface Partido {
  id: number;
  fecha: string;
  hora: string;
  cancha: string;
  costoCancha: number;
  cuotaJugador: number;
  estado: 'Abierta' | 'Cerrada' | 'Finalizada';
}

interface MovimientoPartido {
  jugadorId: number;
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
  imports: [FormsModule],
  templateUrl: './partidos.html',
  styleUrl: './partidos.scss'
})
export class Partidos {

  mostrarFormulario = false;

  mensajeCierre = '';

  errorCierre = '';

  /*
   * Más adelante este valor se guardará en MongoDB
   * para que la distribución de centavos sea rotativa
   * entre diferentes fechas.
   */
  indiceRotacionCentavos = 0;


  partidoActual: Partido = {
    id: 1,
    fecha: '2026-08-29',
    hora: '20:00',
    cancha: 'Asociación de Empleados UTM',
    costoCancha: 28,
    cuotaJugador: 2.25,
    estado: 'Abierta'
  };


  formularioPartido = {
    fecha: '',
    hora: '',
    cancha: '',
    costoCancha: 28
  };


  jugadores: JugadorPartido[] = [

    {
      id: 1,
      nombre: 'Irving',
      confirmacion: 'Confirmado',
      asistio: true
    },

    {
      id: 2,
      nombre: 'Eduardo',
      confirmacion: 'Confirmado',
      asistio: true
    },

    {
      id: 3,
      nombre: 'Víctor Párraga',
      confirmacion: 'No asistirá',
      asistio: false
    },

    {
      id: 4,
      nombre: 'Robinson',
      confirmacion: 'Pendiente',
      asistio: false
    }

  ];


  movimientosGenerados: MovimientoPartido[] = [];

  resumenCierre: ResumenCierre | null = null;


  /* =====================================================
     CONFIRMACIONES
     ===================================================== */

  get totalConfirmados(): number {

    return this.jugadores.filter(
      jugador =>
        jugador.confirmacion === 'Confirmado'
    ).length;

  }


  get totalNoAsistiran(): number {

    return this.jugadores.filter(
      jugador =>
        jugador.confirmacion === 'No asistirá'
    ).length;

  }


  get totalPendientes(): number {

    return this.jugadores.filter(
      jugador =>
        jugador.confirmacion === 'Pendiente'
    ).length;

  }


  /* =====================================================
     ASISTENCIA REAL
     ===================================================== */

  get asistentes(): JugadorPartido[] {

    return this.jugadores.filter(
      jugador => jugador.asistio
    );

  }


  get noAsistentes(): JugadorPartido[] {

    return this.jugadores.filter(
      jugador => !jugador.asistio
    );

  }


  get totalAsistentes(): number {

    return this.asistentes.length;

  }


  /* =====================================================
     CÁLCULOS FINANCIEROS
     ===================================================== */

  get recaudacion(): number {

    return (
      this.totalAsistentes *
      this.partidoActual.cuotaJugador
    );

  }


  get fondoGenerado(): number {

    return (
      this.recaudacion -
      this.partidoActual.costoCancha
    );

  }


  get aporteReferencia(): number {

    if (
      this.totalAsistentes === 0 ||
      this.fondoGenerado <= 0
    ) {
      return 0;
    }

    return (
      this.fondoGenerado /
      this.totalAsistentes
    );

  }


  /* =====================================================
     CREAR PARTIDO
     ===================================================== */

  abrirNuevoPartido(): void {

    this.formularioPartido = {
      fecha: '',
      hora: '',
      cancha: '',
      costoCancha: 28
    };

    this.mostrarFormulario = true;

  }


  cancelarFormulario(): void {

    this.mostrarFormulario = false;

  }


  crearPartido(): void {

    if (
      !this.formularioPartido.fecha ||
      !this.formularioPartido.hora ||
      !this.formularioPartido.cancha.trim()
    ) {
      return;
    }


    this.partidoActual = {

      id: Date.now(),

      fecha:
        this.formularioPartido.fecha,

      hora:
        this.formularioPartido.hora,

      cancha:
        this.formularioPartido.cancha,

      costoCancha:
        Number(
          this.formularioPartido.costoCancha
        ),

      cuotaJugador: 2.25,

      estado: 'Abierta'

    };


    /*
     * Al crear una nueva convocatoria
     * todos comienzan pendientes.
     */
    this.jugadores = this.jugadores.map(
      jugador => ({
        ...jugador,
        confirmacion: 'Pendiente',
        asistio: false
      })
    );


    /*
     * Limpiamos cualquier cierre anterior.
     */
    this.movimientosGenerados = [];

    this.resumenCierre = null;

    this.mensajeCierre = '';

    this.errorCierre = '';

    this.mostrarFormulario = false;

  }


  /* =====================================================
     ASISTENCIA
     ===================================================== */

  cambiarAsistencia(
    jugador: JugadorPartido
  ): void {

    /*
     * Una vez finalizado el partido
     * ya no permitimos cambiar la asistencia.
     */
    if (
      this.partidoActual.estado === 'Finalizada'
    ) {
      return;
    }

    jugador.asistio = !jugador.asistio;

  }


  /* =====================================================
     CONVOCATORIA
     ===================================================== */

  cerrarConvocatoria(): void {

    if (
      this.partidoActual.estado === 'Finalizada'
    ) {
      return;
    }

    this.partidoActual.estado = 'Cerrada';

  }


  reabrirConvocatoria(): void {

    if (
      this.partidoActual.estado === 'Finalizada'
    ) {
      return;
    }

    this.partidoActual.estado = 'Abierta';

  }


  /* =====================================================
     UTILIDADES DE CENTAVOS
     ===================================================== */

  private dineroACentavos(
    valor: number
  ): number {

    return Math.round(valor * 100);

  }


  private centavosADinero(
    centavos: number
  ): number {

    return centavos / 100;

  }


  /*
   * Distribuye una cantidad de centavos de forma exacta.
   *
   * Ejemplo:
   *
   * 1925 centavos / 21 jugadores
   *
   * Base: 91 centavos
   * Resto: 14 centavos
   *
   * 14 jugadores reciben 92
   * 7 reciben 91
   */
  private distribuirCentavos(
    totalCentavos: number,
    cantidadPersonas: number,
    desplazamiento: number
  ): number[] {

    if (
      cantidadPersonas <= 0 ||
      totalCentavos <= 0
    ) {
      return [];
    }


    const base = Math.floor(
      totalCentavos / cantidadPersonas
    );


    const resto =
      totalCentavos % cantidadPersonas;


    const resultado =
      new Array(cantidadPersonas)
        .fill(base);


    /*
     * Los centavos sobrantes se asignan
     * comenzando desde una posición rotativa.
     */
    for (
      let i = 0;
      i < resto;
      i++
    ) {

      const posicion =
        (
          desplazamiento + i
        )
        % cantidadPersonas;

      resultado[posicion] += 1;

    }


    return resultado;

  }


  /* =====================================================
     CIERRE FINANCIERO
     ===================================================== */

  cerrarPartido(): void {

    this.errorCierre = '';

    this.mensajeCierre = '';


    /*
     * Evitar cerrar dos veces.
     */
    if (
      this.partidoActual.estado === 'Finalizada'
    ) {

      this.errorCierre =
        'Este partido ya fue cerrado financieramente.';

      return;

    }


    /*
     * Debe existir al menos un asistente.
     */
    if (
      this.totalAsistentes === 0
    ) {

      this.errorCierre =
        'No se puede cerrar el partido porque no existen asistentes registrados.';

      return;

    }


    /*
     * La recaudación debe cubrir la cancha.
     *
     * Si existe déficit, primero debe corregirse
     * la asistencia, el costo o la situación
     * administrativa correspondiente.
     */
    if (
      this.fondoGenerado < 0
    ) {

      this.errorCierre =
        'La recaudación no cubre todavía el costo de la cancha. No se puede generar el fondo común.';

      return;

    }


    const fondoCentavos =
      this.dineroACentavos(
        this.fondoGenerado
      );


    /*
     * Distribución exacta entre asistentes.
     */
    const creditosCentavos =
      this.distribuirCentavos(
        fondoCentavos,
        this.asistentes.length,
        this.indiceRotacionCentavos
      );


    /*
     * Para las personas que no asistieron,
     * utilizamos el mismo valor promedio
     * de aporte generado por esta fecha.
     *
     * Calculamos la obligación total teórica
     * de los no asistentes en centavos.
     */
    const aportePromedioExacto =
      fondoCentavos /
      this.asistentes.length;


    const deudaTotalCentavos =
      Math.round(
        aportePromedioExacto *
        this.noAsistentes.length
      );


    const deudasCentavos =
      this.distribuirCentavos(
        deudaTotalCentavos,
        this.noAsistentes.length,
        this.indiceRotacionCentavos
      );


    const movimientos: MovimientoPartido[] = [];


    /*
     * Créditos de los asistentes.
     */
    this.asistentes.forEach(
      (jugador, index) => {

        const centavos =
          creditosCentavos[index];

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


    /*
     * Deudas de quienes no asistieron.
     */
    this.noAsistentes.forEach(
      (jugador, index) => {

        const centavos =
          deudasCentavos[index];

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
        (acumulado, valor) =>
          acumulado + valor,
        0
      );


    const totalDeudasCentavos =
      deudasCentavos.reduce(
        (acumulado, valor) =>
          acumulado + valor,
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
        this.partidoActual.costoCancha,

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


    /*
     * Partido finalizado.
     */
    this.partidoActual.estado =
      'Finalizada';


    /*
     * Avanzamos la rotación para que
     * el próximo centavo sobrante no
     * empiece siempre por la misma persona.
     */
    if (
      this.jugadores.length > 0
    ) {

      this.indiceRotacionCentavos =
        (
          this.indiceRotacionCentavos + 1
        )
        % this.jugadores.length;

    }


    this.mensajeCierre =
      'Partido cerrado correctamente. Los movimientos del fondo común fueron generados.';

  }

}