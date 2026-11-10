import {
  Component,
  inject
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';


@Component({
  selector: 'app-admin-layout',

  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],

  templateUrl:
    './admin-layout.html',

  styleUrl:
    './admin-layout.scss'
})
export class AdminLayout {

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  cerrarSesion(): void {

    this.authService
      .cerrarSesion();

    this.router.navigate([
      '/login'
    ]);

  }

}