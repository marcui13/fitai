import { Injectable } from '@angular/core';
import { GeminiService } from './gemini.service';
import { OpenAiService, WorkoutPlan } from './open-ai.service';
import { UserProfile } from '../models/user-profile.model';
import { AIModelService, AIModel } from './ai-model.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutGeneratorService {
  constructor(
    private geminiService: GeminiService,
    private openAiService: OpenAiService,
    private aiModelService: AIModelService
  ) {}

  generateWorkoutPlan(profile: UserProfile): Observable<WorkoutPlan> {
    const currentModel = this.aiModelService.getCurrentModel();
    
    if (currentModel === 'gemini') {
      return this.geminiService.generateWorkoutPlan(profile);
    } else {
      return from(this.openAiService.generateWorkoutPlan(profile));
    }
  }
} 