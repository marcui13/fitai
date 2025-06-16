import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  currentLang = 'es';

  constructor(
    private menu: MenuController,
    private router: Router,
  ) {
    // Cerrar el menú cuando se navega a una nueva ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
    });
  }

  openMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  closeMenu() {
    this.menu.close('first');
  }

  toggleMenu() {
    this.menu.toggle('first');
  }

  // Método para cerrar el menú al hacer clic fuera
  onBackdropClick() {
    this.closeMenu();
  }
}
