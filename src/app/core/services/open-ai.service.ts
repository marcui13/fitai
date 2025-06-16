import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../.env/environment';
import { firstValueFrom } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';

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
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${environment.openaiApiKey}`
  });

  constructor(private http: HttpClient) {}

  async generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
    const prompt = this.constructPrompt(profile);
    
    try {
      const response = await this.http.post<any>(this.apiUrl, {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness trainer. Generate a personalized workout plan in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      }, { headers: this.headers }).toPromise();

      const content = response.choices[0].message.content;
      const workoutPlan = JSON.parse(content);

      if (!this.isValidWorkoutPlan(workoutPlan)) {
        throw new Error('Invalid workout plan structure received from API');
      }

      return workoutPlan;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw error;
    }
  }

  private constructPrompt(profile: UserProfile): string {
    return `Generate a personalized workout plan for the following profile:
    Age: ${profile.age}
    Height: ${profile.height} cm
    Weight: ${profile.weight} kg
    Gender: ${profile.gender}
    Fitness Level: ${profile.fitnessLevel}
    Goal: ${profile.goal}
    Available Days per Week: ${profile.availableDays}
    Equipment: ${profile.equipment}
    BMI: ${profile.bmi.toFixed(1)}

    Please provide the response in the following JSON format:
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
              "rest": "string (optional)",
              "notes": "string (optional)"
            }
          ]
        }
      ],
      "generalNotes": "string"
    }`;
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
          typeof exercise.reps === 'string' &&
          (!exercise.rest || typeof exercise.rest === 'string') &&
          (!exercise.notes || typeof exercise.notes === 'string')
        )
      ) &&
      typeof plan.generalNotes === 'string'
    );
  }
} 