import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserProfile } from '../../core/models/user-profile.model';
import { WorkoutPlan } from '../../core/services/open-ai.service';
import { HistoryService } from '../../core/services/history.service';
import { WorkoutGeneratorService } from '../../core/services/workout-generator.service';

@Component({
  selector: 'app-workout-result',
  templateUrl: './workout-result.page.html',
  styleUrls: ['./workout-result.page.scss'],
  standalone: false
})
export class WorkoutResultPage implements OnInit {
  profile: UserProfile | null = null;
  workoutPlan: WorkoutPlan | undefined;
  isLoading = false;
  error: string | null = null;
  isFromHistory = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private workoutGeneratorService: WorkoutGeneratorService,
    private historyService: HistoryService,
    private toastController: ToastController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.profile = navigation.extras.state['profile'] as UserProfile;
    }
  }

  ngOnInit() {
    if (this.profile) {
      this.generatePlan();
    } else {
      this.error = 'No se encontraron datos del perfil. Por favor, completa el formulario nuevamente.';
    }
  }

  async generatePlan() {
    if (!this.profile) return;

    this.isLoading = true;
    this.error = null;

    try {
      this.workoutPlan = await this.workoutGeneratorService.generateWorkoutPlan(this.profile).toPromise();
    } catch (err) {
      this.error = 'No se pudo generar el plan de entrenamiento. Por favor, intenta de nuevo.';
      console.error('Error generating workout plan:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async copyToClipboard() {
    if (!this.workoutPlan) return;

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
    if (!this.workoutPlan) return '';

    let text = `${this.workoutPlan.title}\n\n`;
    text += `${this.workoutPlan.description}\n\n`;

    this.workoutPlan.weeklySchedule.forEach(day => {
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

    text += `Notas Generales:\n${this.workoutPlan.generalNotes}\n\n`;
    text += `Frase Motivacional:\n${this.workoutPlan.motivationalQuote}\n\n`;
    text += `Consejo del Día:\n${this.workoutPlan.dailyTip}`;
    
    return text;
  }
} 