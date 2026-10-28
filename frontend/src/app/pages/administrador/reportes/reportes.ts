import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TipoReporte =
  | 'General'
  | 'Partidos'
  | 'Tesoreria'
  | 'Actividades';

interface FilaReporte {
  id: number;
  fecha: string;
  categoria: 'Partidos' | 'Tesoreria' | 'Actividades';
  detalle: string;
  estado: string;
  valor: number;
}

@Component({
  selector: 'app-reportes',
  imports: [FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss'
})
export class Reportes {

  tipoReporte: TipoReporte = 'General';

  fechaDesde = '';
  fechaHasta = '';

  mensaje = '';


  registros: FilaReporte[] = [

    {
      id: 1,
      fecha: '2026-08-06',
      categoria: 'Partidos',
      detalle: 'Partido - Complejo Deportivo',
      estado: 'Finalizado',
      valor: 7
    },

    {
      id: 2,
      fecha: '2026-08-10',
      categoria: 'Tesoreria',
      detalle: 'Pago Fiesta de Gala - Víctor Párraga',
      estado: 'Registrado',
      valor: 25
    },

    {
      id: 3,
      fecha: '2026-08-13',
      categoria: 'Partidos',
      detalle: 'Partido - Asociación de Empleados UTM',
      estado: 'Finalizado',
      valor: 19.25
    },

    {
      id: 4,
      fecha: '2026-08-15',
      categoria: 'Tesoreria',
      detalle: 'Pago Cumpleaños - Eduardo',
      estado: 'Registrado',
      valor: 10
    },

    {
      id: 5,
      fecha: '2026-08-20',
      categoria: 'Tesoreria',
      detalle: 'Pago Fondo común - Irving',
      estado: 'Registrado',
      valor: 1.25
    },

    {
      id: 6,
      fecha: '2026-08-29',
      categoria: 'Partidos',
      detalle: 'Partido - Asociación de Empleados UTM',
      estado: 'Convocatoria abierta',
      valor: 28
    },

    {
      id: 7,
      fecha: '2026-09-01',
      categoria: 'Actividades',
      detalle: 'Cumpleaños',
      estado: 'Activa',
      valor: 35
    },

    {
      id: 8,
      fecha: '2026-09-05',
      categoria: 'Actividades',
      detalle: 'Fiesta de Gala 2026',
      estado: 'Activa',
      valor: 110
    }

  ];


  /* =====================================================
     FILTRADO
     ===================================================== */

  get registrosFiltrados(): FilaReporte[] {

    return this.registros.filter(
      registro => {

        const coincideTipo =
          this.tipoReporte === 'General'
          ||
          registro.categoria ===
            this.tipoReporte;


        const coincideDesde =
          !this.fechaDesde
          ||
          registro.fecha >=
            this.fechaDesde;


        const coincideHasta =
          !this.fechaHasta
          ||
          registro.fecha <=
            this.fechaHasta;


        return (
          coincideTipo
          &&
          coincideDesde
          &&
          coincideHasta
        );

      }
    );

  }


  /* =====================================================
     INDICADORES
     ===================================================== */

  get totalRegistros(): number {

    return this.registrosFiltrados.length;

  }


  get totalValores(): number {

    return this.registrosFiltrados.reduce(
      (total, registro) =>
        total + registro.valor,
      0
    );

  }


  get totalPartidos(): number {

    return this.registrosFiltrados.filter(
      registro =>
        registro.categoria === 'Partidos'
    ).length;

  }


  get totalMovimientosTesoreria(): number {

    return this.registrosFiltrados.filter(
      registro =>
        registro.categoria === 'Tesoreria'
    ).length;

  }


  /* =====================================================
     FILTROS
     ===================================================== */

  limpiarFiltros(): void {

    this.tipoReporte = 'General';

    this.fechaDesde = '';

    this.fechaHasta = '';

    this.mensaje = '';

  }


  /* =====================================================
     EXPORTAR CSV
     ===================================================== */

  exportarCSV(): void {

    const filas =
      this.registrosFiltrados;


    if (filas.length === 0) {

      this.mensaje =
        'No existen datos para exportar.';

      return;

    }


    const encabezado = [
      'Fecha',
      'Categoria',
      'Detalle',
      'Estado',
      'Valor'
    ];


    const contenido = [

      encabezado.join(','),

      ...filas.map(
        fila => {

          const detalleSeguro =
            `"${fila.detalle.replace(
              /"/g,
              '""'
            )}"`;


          return [
            fila.fecha,
            fila.categoria,
            detalleSeguro,
            fila.estado,
            fila.valor.toFixed(2)
          ].join(',');

        }
      )

    ].join('\n');


    const blob =
      new Blob(
        [contenido],
        {
          type:
            'text/csv;charset=utf-8;'
        }
      );


    const url =
      URL.createObjectURL(blob);


    const enlace =
      document.createElement('a');


    enlace.href = url;

    enlace.download =
      `reporte-40fc-${this.tipoReporte.toLowerCase()}.csv`;


    enlace.click();


    URL.revokeObjectURL(url);


    this.mensaje =
      'Reporte exportado correctamente.';

  }


  /* =====================================================
     IMPRIMIR
     ===================================================== */

  imprimirReporte(): void {

    window.print();

  }

}