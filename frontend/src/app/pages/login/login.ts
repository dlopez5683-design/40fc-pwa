import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly router = inject(Router);

  entrarComoJugador(event: Event): void {
    event.preventDefault();

    this.router.navigate(['/jugador']);
  }

}