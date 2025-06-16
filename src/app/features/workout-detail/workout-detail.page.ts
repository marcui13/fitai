import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HistoryService, WorkoutHistory } from '../../core/services/history.service';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.page.html',
  styleUrls: ['./workout-detail.page.scss'],
  standalone: false
})
export class WorkoutDetailPage implements OnInit {
  workout: WorkoutHistory | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private historyService: HistoryService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadWorkout(id);
    } else {
      this.error = 'No se encontró el plan de entrenamiento solicitado.';
    }
  }

  private loadWorkout(id: string) {
    const workout = this.historyService.getWorkoutById(id);
    if (workout) {
      this.workout = workout;
    } else {
      this.error = 'No se encontró el plan de entrenamiento solicitado.';
    }
  }

  async copyToClipboard() {
    if (!this.workout) return;

    const text = this.formatWorkoutPlanForClipboard();
    await navigator.clipboard.writeText(text);

    const toast = await this.toastController.create({
      message: 'Plan de entrenamiento copiado al portapapeles',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  private formatWorkoutPlanForClipboard(): string {
    if (!this.workout) return '';

    const plan = this.workout.workoutPlan;
    let text = `${plan.title}\n\n`;
    text += `${plan.description}\n\n`;

    plan.weeklySchedule.forEach(day => {
      text += `Día ${day.dayNumber} - ${day.focus}\n`;
      day.exercises.forEach(exercise => {
        text += `\n${exercise.name}\n`;
        text += `Series: ${exercise.sets}\n`;
        text += `Repeticiones: ${exercise.reps}\n`;
        if (exercise.rest) text += `Descanso: ${exercise.rest}\n`;
        if (exercise.notes) text += `Notas: ${exercise.notes}\n`;
      });
      text += '\n';
    });

    text += `Notas Generales:\n${plan.generalNotes}\n\n`;
    text += `Frase Motivacional:\n${plan.motivationalQuote}\n\n`;
    text += `Consejo del Día:\n${plan.dailyTip}`;
    
    return text;
  }

  async confirmDelete() {
    if (!this.workout) return;

    const alert = await this.toastController.create({
      header: 'Eliminar Plan',
      message: '¿Estás seguro de que quieres eliminar este plan de entrenamiento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.historyService.removeFromHistory(this.workout!.id);
            this.router.navigate(['/workout-history']);
          }
        }
      ]
    });

    await alert.present();
  }
} 