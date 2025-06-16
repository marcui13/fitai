import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkoutPlan } from './open-ai.service';
import { UserProfile } from '../models/user-profile.model';
import { AIModel } from './ai-model.service';

export interface WorkoutHistory {
  id: string;
  date: Date;
  profile: UserProfile;
  workoutPlan: WorkoutPlan;
  aiModel: AIModel;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private readonly STORAGE_KEY = 'workout_history';
  private readonly MAX_HISTORY_ITEMS = 10;
  private historySubject = new BehaviorSubject<WorkoutHistory[]>([]);
  public history$ = this.historySubject.asObservable();

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    const storedHistory = localStorage.getItem(this.STORAGE_KEY);
    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      // Convertir las fechas de string a Date
      history.forEach((item: WorkoutHistory) => {
        item.date = new Date(item.date);
      });
      this.historySubject.next(history);
    }
  }

  private saveHistory(history: WorkoutHistory[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    this.historySubject.next(history);
  }

  addToHistory(profile: UserProfile, workoutPlan: WorkoutPlan, aiModel: AIModel): void {
    const history = this.historySubject.value;
    const newEntry: WorkoutHistory = {
      id: Date.now().toString(),
      date: new Date(),
      profile,
      workoutPlan,
      aiModel
    };

    // Agregar al inicio del array y mantener solo los últimos MAX_HISTORY_ITEMS
    history.unshift(newEntry);
    if (history.length > this.MAX_HISTORY_ITEMS) {
      history.pop();
    }

    this.saveHistory(history);
  }

  getHistory(): Observable<WorkoutHistory[]> {
    return this.historySubject.asObservable();
  }

  getWorkoutById(id: string): WorkoutHistory | undefined {
    return this.historySubject.value.find(item => item.id === id);
  }

  clearHistory(): void {
    this.saveHistory([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  removeFromHistory(id: string): void {
    const history = this.historySubject.value.filter(item => item.id !== id);
    this.saveHistory(history);
  }
} 