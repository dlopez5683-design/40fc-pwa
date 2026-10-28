import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ConceptoPago =
  | 'Fondo común'
  | 'Cumpleaños'
  | 'Fiesta de gala';

type FormaPago =
  | 'Efectivo'
  | 'Transferencia';

interface EstadoJugador {
  id: number;
  nombre: string;

  fondoAcumulado: number;
  deudaFondo: number;

  cumpleanosAsignado: number;
  cumpleanosPagado: number;

  galaAsignada: number;
  galaPagada: number;
}

interface MovimientoTesoreria {
  id: number;
  jugadorId: number;
  jugadorNombre: string;

  concepto: ConceptoPago;
  formaPago: FormaPago;

  valor: number;
  fecha: string;
}

@Component({
  selector: 'app-tesoreria',
  imports: [FormsModule],
  templateUrl: './tesoreria.html',
  styleUrl: './tesoreria.scss'
})
export class Tesoreria {

  busqueda = '';

  mostrarFormularioPago = false;

  mensaje = '';
  error = '';


  jugadores: EstadoJugador[] = [

    {
      id: 1,
      nombre: 'Irving',

      fondoAcumulado: 18.75,
      deudaFondo: 0,

      cumpleanosAsignado: 10,
      cumpleanosPagado: 10,

      galaAsignada: 40,
      galaPagada: 25
    },

    {
      id: 2,
      nombre: 'Eduardo',

      fondoAcumulado: 17.83,
      deudaFondo: 0.92,

      cumpleanosAsignado: 10,
      cumpleanosPagado: 10,

      galaAsignada: 40,
      galaPagada: 40
    },

    {
      id: 3,
      nombre: 'Víctor Párraga',

      fondoAcumulado: 16.50,
      deudaFondo: 1.25,

      cumpleanosAsignado: 10,
      cumpleanosPagado: 5,

      galaAsignada: 40,
      galaPagada: 25
    },

    {
      id: 4,
      nombre: 'Robinson',

      fondoAcumulado: 19.25,
      deudaFondo: 0.50,

      cumpleanosAsignado: 10,
      cumpleanosPagado: 10,

      galaAsignada: 40,
      galaPagada: 20
    }

  ];


  movimientos: MovimientoTesoreria[] = [

    {
      id: 1,
      jugadorId: 1,
      jugadorNombre: 'Irving',
      concepto: 'Fondo común',
      formaPago: 'Efectivo',
      valor: 1.25,
      fecha: '2026-08-20'
    },

    {
      id: 2,
      jugadorId: 2,
      jugadorNombre: 'Eduardo',
      concepto: 'Cumpleaños',
      formaPago: 'Transferencia',
      valor: 10,
      fecha: '2026-08-15'
    },

    {
      id: 3,
      jugadorId: 3,
      jugadorNombre: 'Víctor Párraga',
      concepto: 'Fiesta de gala',
      formaPago: 'Transferencia',
      valor: 25,
      fecha: '2026-08-10'
    }

  ];


  formularioPago = {

    jugadorId: 0,

    concepto:
      'Fondo común' as ConceptoPago,

    valor: 0,

    formaPago:
      'Efectivo' as FormaPago,

    fecha: ''

  };


  /* =====================================================
     BUSCADOR
     ===================================================== */

  get jugadoresFiltrados(): EstadoJugador[] {

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
          .includes(termino)
    );

  }


  /* =====================================================
     RESUMEN GENERAL
     ===================================================== */

  get fondoTotal(): number {

    return this.jugadores.reduce(
      (total, jugador) =>
        total + jugador.fondoAcumulado,
      0
    );

  }


  get deudaFondoTotal(): number {

    return this.jugadores.reduce(
      (total, jugador) =>
        total + jugador.deudaFondo,
      0
    );

  }


  get cumpleanosRecaudado(): number {

    return this.jugadores.reduce(
      (total, jugador) =>
        total + jugador.cumpleanosPagado,
      0
    );

  }


  get cumpleanosPendiente(): number {

    return this.jugadores.reduce(
      (total, jugador) =>
        total +
        (
          jugador.cumpleanosAsignado -
          jugador.cumpleanosPagado
        ),
      0
    );

  }


  get galaRecaudada(): number {

    return this.jugadores.reduce(
      (total, jugador) =>
        total + jugador.galaPagada,
      0
    );

  }


  get galaPendiente(): number {

    return this.jugadores.reduce(
      (total, jugador) =>
        total +
        (
          jugador.galaAsignada -
          jugador.galaPagada
        ),
      0
    );

  }


  get totalDeudas(): number {

    return (
      this.deudaFondoTotal +
      this.cumpleanosPendiente +
      this.galaPendiente
    );

  }


  /* =====================================================
     DEUDAS INDIVIDUALES
     ===================================================== */

  deudaCumpleanos(
    jugador: EstadoJugador
  ): number {

    return Math.max(
      0,
      jugador.cumpleanosAsignado -
      jugador.cumpleanosPagado
    );

  }


  deudaGala(
    jugador: EstadoJugador
  ): number {

    return Math.max(
      0,
      jugador.galaAsignada -
      jugador.galaPagada
    );

  }


  deudaTotalJugador(
    jugador: EstadoJugador
  ): number {

    return (
      jugador.deudaFondo +
      this.deudaCumpleanos(jugador) +
      this.deudaGala(jugador)
    );

  }


  /* =====================================================
     FORMULARIO DE PAGO
     ===================================================== */

  abrirPago(
    jugador?: EstadoJugador,
    concepto?: ConceptoPago
  ): void {

    this.mensaje = '';
    this.error = '';

    const hoy =
      new Date()
        .toISOString()
        .slice(0, 10);


    this.formularioPago = {

      jugadorId:
        jugador?.id ?? 0,

      concepto:
        concepto ?? 'Fondo común',

      valor: 0,

      formaPago:
        'Efectivo',

      fecha:
        hoy

    };


    if (jugador && concepto) {

      if (
        concepto === 'Fondo común'
      ) {

        this.formularioPago.valor =
          jugador.deudaFondo;

      }


      if (
        concepto === 'Cumpleaños'
      ) {

        this.formularioPago.valor =
          this.deudaCumpleanos(
            jugador
          );

      }


      if (
        concepto === 'Fiesta de gala'
      ) {

        this.formularioPago.valor =
          this.deudaGala(
            jugador
          );

      }

    }


    this.mostrarFormularioPago = true;

  }


  cancelarPago(): void {

    this.mostrarFormularioPago = false;

  }


  registrarPago(): void {

    this.error = '';
    this.mensaje = '';


    const jugador =
      this.jugadores.find(
        item =>
          item.id ===
          Number(
            this.formularioPago.jugadorId
          )
      );


    if (!jugador) {

      this.error =
        'Selecciona un jugador.';

      return;

    }


    const valor =
      Number(
        this.formularioPago.valor
      );


    if (
      !valor ||
      valor <= 0
    ) {

      this.error =
        'Ingresa un valor válido.';

      return;

    }


    if (
      !this.formularioPago.fecha
    ) {

      this.error =
        'Selecciona la fecha del pago.';

      return;

    }


    /*
     * Determinar deuda pendiente
     * según el concepto seleccionado.
     */

    let pendiente = 0;


    if (
      this.formularioPago.concepto ===
      'Fondo común'
    ) {

      pendiente =
        jugador.deudaFondo;

    }


    if (
      this.formularioPago.concepto ===
      'Cumpleaños'
    ) {

      pendiente =
        this.deudaCumpleanos(
          jugador
        );

    }


    if (
      this.formularioPago.concepto ===
      'Fiesta de gala'
    ) {

      pendiente =
        this.deudaGala(
          jugador
        );

    }


    /*
     * Evitar pagos superiores
     * al valor pendiente.
     */

    if (
      valor > pendiente + 0.001
    ) {

      this.error =
        `El valor supera la deuda pendiente de $${pendiente.toFixed(2)}.`;

      return;

    }


    /*
     * Aplicar pago de fondo común.
     */

    if (
      this.formularioPago.concepto ===
      'Fondo común'
    ) {

      jugador.deudaFondo =
        Math.max(
          0,
          jugador.deudaFondo -
          valor
        );

      jugador.fondoAcumulado +=
        valor;

    }


    /*
     * Aplicar pago de cumpleaños.
     */

    if (
      this.formularioPago.concepto ===
      'Cumpleaños'
    ) {

      jugador.cumpleanosPagado +=
        valor;

    }


    /*
     * Aplicar pago de gala.
     */

    if (
      this.formularioPago.concepto ===
      'Fiesta de gala'
    ) {

      jugador.galaPagada +=
        valor;

    }


    /*
     * Registrar movimiento.
     */

    this.movimientos.unshift({

      id:
        Date.now(),

      jugadorId:
        jugador.id,

      jugadorNombre:
        jugador.nombre,

      concepto:
        this.formularioPago.concepto,

      formaPago:
        this.formularioPago.formaPago,

      valor:
        valor,

      fecha:
        this.formularioPago.fecha

    });


    this.mensaje =
      'Pago registrado correctamente.';


    this.mostrarFormularioPago =
      false;

  }

}