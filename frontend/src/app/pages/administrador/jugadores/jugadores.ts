import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Jugador {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-jugadores',
  imports: [FormsModule],
  templateUrl: './jugadores.html',
  styleUrl: './jugadores.scss'
})
export class Jugadores {

  busqueda = '';

  mostrarFormulario = false;

  editandoId: number | null = null;


  formulario = {
    nombre: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    fechaIngreso: ''
  };


  jugadores: Jugador[] = [

    {
      id: 1,
      nombre: 'Irving',
      correo: 'irving@40fc.com',
      telefono: '0990000001',
      fechaNacimiento: '1985-05-15',
      fechaIngreso: '2024-01-15',
      estado: 'Activo'
    },

    {
      id: 2,
      nombre: 'Eduardo',
      correo: 'eduardo@40fc.com',
      telefono: '0990000002',
      fechaNacimiento: '1987-08-20',
      fechaIngreso: '2024-01-15',
      estado: 'Activo'
    },

    {
      id: 3,
      nombre: 'Víctor Párraga',
      correo: 'victor@40fc.com',
      telefono: '0990000003',
      fechaNacimiento: '1986-03-12',
      fechaIngreso: '2024-02-01',
      estado: 'Activo'
    },

    {
      id: 4,
      nombre: 'Robinson',
      correo: 'robinson@40fc.com',
      telefono: '0990000004',
      fechaNacimiento: '1988-11-07',
      fechaIngreso: '2024-02-15',
      estado: 'Activo'
    }

  ];


  /*
   * Filtrar jugadores por nombre o correo
   */
  get jugadoresFiltrados(): Jugador[] {

    const termino = this.busqueda
      .trim()
      .toLowerCase();

    if (!termino) {
      return this.jugadores;
    }

    return this.jugadores.filter(jugador =>

      jugador.nombre
        .toLowerCase()
        .includes(termino)

      ||

      jugador.correo
        .toLowerCase()
        .includes(termino)

    );

  }


  /*
   * Cantidad de jugadores activos
   */
  get totalActivos(): number {

    return this.jugadores.filter(
      jugador => jugador.estado === 'Activo'
    ).length;

  }


  /*
   * Cantidad de jugadores inactivos
   */
  get totalInactivos(): number {

    return this.jugadores.filter(
      jugador => jugador.estado === 'Inactivo'
    ).length;

  }


  /*
   * Abrir formulario para nuevo jugador
   */
  abrirNuevoJugador(): void {

    this.editandoId = null;

    this.formulario = {
      nombre: '',
      correo: '',
      telefono: '',
      fechaNacimiento: '',
      fechaIngreso: ''
    };

    this.mostrarFormulario = true;

  }


  /*
   * Abrir formulario para editar jugador
   */
  editarJugador(jugador: Jugador): void {

    this.editandoId = jugador.id;

    this.formulario = {
      nombre: jugador.nombre,
      correo: jugador.correo,
      telefono: jugador.telefono,
      fechaNacimiento: jugador.fechaNacimiento,
      fechaIngreso: jugador.fechaIngreso
    };

    this.mostrarFormulario = true;

  }


  /*
   * Cerrar formulario
   */
  cancelarFormulario(): void {

    this.mostrarFormulario = false;

    this.editandoId = null;

  }


  /*
   * Guardar nuevo jugador
   * o actualizar uno existente
   */
  guardarJugador(): void {

    /*
     * Validación mínima
     */
    if (
      !this.formulario.nombre.trim()
      ||
      !this.formulario.correo.trim()
    ) {
      return;
    }


    /*
     * Si estamos editando
     */
    if (this.editandoId !== null) {

      const jugador = this.jugadores.find(
        item => item.id === this.editandoId
      );

      if (jugador) {

        jugador.nombre =
          this.formulario.nombre;

        jugador.correo =
          this.formulario.correo;

        jugador.telefono =
          this.formulario.telefono;

        jugador.fechaNacimiento =
          this.formulario.fechaNacimiento;

        jugador.fechaIngreso =
          this.formulario.fechaIngreso;

      }

    }

    /*
     * Si estamos creando
     */
    else {

      const nuevoJugador: Jugador = {

        id: Date.now(),

        nombre:
          this.formulario.nombre,

        correo:
          this.formulario.correo,

        telefono:
          this.formulario.telefono,

        fechaNacimiento:
          this.formulario.fechaNacimiento,

        fechaIngreso:
          this.formulario.fechaIngreso,

        estado: 'Activo'

      };

      this.jugadores.push(nuevoJugador);

    }


    /*
     * Cerrar formulario al terminar
     */
    this.cancelarFormulario();

  }


  /*
   * Activar o desactivar jugador
   */
  cambiarEstado(jugador: Jugador): void {

    jugador.estado =
      jugador.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';

  }

}