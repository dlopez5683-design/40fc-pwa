import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil {

  mostrarCambioPassword = false;

  alternarCambioPassword(): void {
    this.mostrarCambioPassword = !this.mostrarCambioPassword;
  }

}