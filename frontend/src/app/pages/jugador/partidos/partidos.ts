import { Component } from '@angular/core';

@Component({
  selector: 'app-partidos',
  imports: [],
  templateUrl: './partidos.html',
  styleUrl: './partidos.scss'
})
export class Partidos {

  respuesta: 'pendiente' | 'confirmado' | 'no_asiste' = 'pendiente';

  confirmar(): void {
    this.respuesta = 'confirmado';
  }

  noAsistir(): void {
    this.respuesta = 'no_asiste';
  }

}