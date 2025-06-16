import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserProfile } from '../../core/models/user-profile.model';
import { OpenAiService, WorkoutPlan } from '../../core/services/open-ai.service';

@Component({
  selector: 'app-workout-result',
  templateUrl: './workout-result.page.html',
  styleUrls: ['./workout-result.page.scss'],
  standalone: false
})
export class WorkoutResultPage implements OnInit {
  profile: UserProfile | null = null;
  workoutPlan: WorkoutPlan | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private openAiService: OpenAiService,
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
      this.error = 'No profile data found. Please fill out the form again.';
    }
  }

  async generatePlan() {
    if (!this.profile) return;

    this.isLoading = true;
    this.error = null;

    try {
      this.workoutPlan = await this.openAiService.generateWorkoutPlan(this.profile);
    } catch (err) {
      this.error = 'Failed to generate workout plan. Please try again.';
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
      message: 'Workout plan copied to clipboard!',
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
      text += `Day ${day.dayNumber} - ${day.focus}\n`;
      day.exercises.forEach(exercise => {
        text += `\n${exercise.name}\n`;
        text += `Sets: ${exercise.sets}\n`;
        text += `Reps: ${exercise.reps}\n`;
        if (exercise.rest) text += `Rest: ${exercise.rest}\n`;
        if (exercise.notes) text += `Notes: ${exercise.notes}\n`;
      });
      text += '\n';
    });

    text += `General Notes:\n${this.workoutPlan.generalNotes}`;
    return text;
  }
} 