import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HistoryService, WorkoutHistory } from '../../core/services/history.service';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.page.html',
  styleUrls: ['./workout-history.page.scss'],
  standalone: false
})
export class WorkoutHistoryPage implements OnInit {
  history: WorkoutHistory[] = [];

  constructor(
    private historyService: HistoryService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.historyService.getHistory().subscribe(history => {
      this.history = history;
    });
  }

  viewWorkoutPlan(workout: WorkoutHistory) {
    this.router.navigate(['/workout-result'], {
      state: { 
        profile: workout.profile,
        workoutPlan: workout.workoutPlan
      }
    });
  }

  async confirmDelete(id: string) {
    const alert = await this.alertController.create({
      header: 'Delete Workout',
      message: 'Are you sure you want to delete this workout from history?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.historyService.removeFromHistory(id);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmClearHistory() {
    const alert = await this.alertController.create({
      header: 'Clear History',
      message: 'Are you sure you want to clear all workout history?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Clear',
          handler: () => {
            this.historyService.clearHistory();
          }
        }
      ]
    });

    await alert.present();
  }
} 