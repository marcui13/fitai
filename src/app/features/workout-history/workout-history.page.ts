import { Component, OnInit } from '@angular/core';
import { HistoryService, WorkoutHistory } from '../../core/services/history.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.page.html',
  styleUrls: ['./workout-history.page.scss'],
  standalone: false
})
export class WorkoutHistoryPage implements OnInit {
  history$: Observable<WorkoutHistory[]>;

  constructor(
    private historyService: HistoryService,
    private alertController: AlertController
  ) {
    this.history$ = this.historyService.history$;
  }

  ngOnInit() {}

  getGoalLabel(goal: string): string {
    const goals: { [key: string]: string } = {
      'weight_loss': 'Pérdida de peso',
      'muscle_gain': 'Ganancia muscular',
      'endurance': 'Resistencia',
      'strength': 'Fuerza',
      'flexibility': 'Flexibilidad',
      'general_fitness': 'Fitness general'
    };
    return goals[goal] || goal;
  }

  async confirmClearHistory() {
    const alert = await this.alertController.create({
      header: '¿Eliminar todo el historial?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.historyService.clearHistory();
          }
        }
      ]
    });

    await alert.present();
  }
} 