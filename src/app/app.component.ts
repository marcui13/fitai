import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AIModelService, AIModel } from './core/services/ai-model.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  currentLang = 'es';
  selectedModel: AIModel;

  constructor(
    private menu: MenuController,
    private router: Router,
    private aiModelService: AIModelService
  ) {
    // Cerrar el menú cuando se navega a una nueva ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
    });

    this.selectedModel = this.aiModelService.getCurrentModel();
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

  onModelChange(event: any) {
    this.aiModelService.setModel(event.detail.value);
  }
}
