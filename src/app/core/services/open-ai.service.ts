import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from '../models/user-profile.model';
import { HistoryService } from './history.service';
import {environment} from '../../../.env/environment'
export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest?: string;
  notes?: string;
}

export interface WorkoutDay {
  dayNumber: number;
  focus: string;
  exercises: WorkoutExercise[];
  motivationalQuote: string;
  dailyTip: string;
}

export interface WorkoutPlan {
  title: string;
  description: string;
  weeklySchedule: WorkoutDay[];
  generalNotes: string;
}

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private http: HttpClient,
    private historyService: HistoryService
  ) {}

  async generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.openaiApiKey}`
    });

    const prompt = this.constructPrompt(profile);

    try {
      const response = await this.http.post(this.apiUrl, {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness trainer and nutritionist. Generate personalized workout plans based on user profiles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      }, { headers }).toPromise();

      const content = (response as any).choices[0].message.content;
      const workoutPlan = this.parseWorkoutPlan(content);
      
      // Guardar en el historial
      this.historyService.addToHistory(profile, workoutPlan);
      
      return workoutPlan;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw new Error('Failed to generate workout plan');
    }
  }

  private constructPrompt(profile: UserProfile): string {
    return `Create a personalized ${profile.availableDays}-day workout plan for a ${profile.age}-year-old ${profile.gender} with the following characteristics:
    - Height: ${profile.height}cm
    - Weight: ${profile.weight}kg
    - BMI: ${profile.bmi.toFixed(1)}
    - Fitness Level: ${profile.fitnessLevel}
    - Goal: ${profile.goal}
    - Available Equipment: ${profile.equipment}

    The response should be a JSON object with the following structure:
    {
      "title": "string",
      "description": "string",
      "weeklySchedule": [
        {
          "dayNumber": number,
          "focus": "string",
          "exercises": [
            {
              "name": "string",
              "sets": number,
              "reps": "string",
              "rest": "string",
              "notes": "string"
            }
          ],
          "motivationalQuote": "string",
          "dailyTip": "string"
        }
      ],
      "generalNotes": "string"
    }

    Include a motivational quote and a daily tip for each workout day. The quote should be inspiring and related to fitness or personal growth. The tip should be practical advice related to the day's workout or general fitness.`;
  }

  private parseWorkoutPlan(content: string): WorkoutPlan {
    try {
      const workoutPlan = JSON.parse(content);
      if (this.isValidWorkoutPlan(workoutPlan)) {
        return workoutPlan;
      }
      throw new Error('Invalid workout plan structure');
    } catch (error) {
      console.error('Error parsing workout plan:', error);
      throw new Error('Failed to parse workout plan');
    }
  }

  private isValidWorkoutPlan(plan: any): plan is WorkoutPlan {
    return (
      plan &&
      typeof plan.title === 'string' &&
      typeof plan.description === 'string' &&
      Array.isArray(plan.weeklySchedule) &&
      plan.weeklySchedule.every((day: any) =>
        typeof day.dayNumber === 'number' &&
        typeof day.focus === 'string' &&
        Array.isArray(day.exercises) &&
        day.exercises.every((exercise: any) =>
          typeof exercise.name === 'string' &&
          typeof exercise.sets === 'number' &&
          typeof exercise.reps === 'string'
        ) &&
        typeof day.motivationalQuote === 'string' &&
        typeof day.dailyTip === 'string'
      ) &&
      typeof plan.generalNotes === 'string'
    );
  }
} 