import { Injectable } from '@angular/core';
import { UserProfile } from '../models/user-profile.model';
import { HistoryService } from './history.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../.env/environment';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest?: string;
  notes?: string;
}

export interface WorkoutDay {
  dayNumber: number;
  focus: string;
  exercises: Exercise[];
  motivationalQuote: string;
  dailyTip: string;
}

export interface WorkoutPlan {
  title: string;
  description: string;
  weeklySchedule: WorkoutDay[];
  generalNotes: string;
  motivationalQuote: string;
  dailyTip: string;
}

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private historyService: HistoryService,
    private http: HttpClient
  ) {}

  async generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
    try {
      const response = await this.http.post(this.OPENAI_API_URL, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto entrenador personal y nutricionista. Genera planes de entrenamiento personalizados en español, incluyendo ejercicios específicos, series, repeticiones y descansos. Incluye una frase motivacional y un consejo del día para cada día de entrenamiento.'
          },
          {
            role: 'user',
            content: this.createPrompt(profile)
          }
        ],
        temperature: 0.2
      }, {
        headers: {
          'Authorization': `Bearer ${environment.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }).toPromise();

      const result = this.parseResponse(response);
      this.validateWorkoutPlan(result);
      
      // Guardar en el historial
      this.historyService.addToHistory(profile, result, 'openai');
      
      return result;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw new Error('No se pudo generar el plan de entrenamiento. Por favor, intenta de nuevo.');
    }
  }

  private createPrompt(profile: UserProfile): string {
    return `Genera un plan de entrenamiento personalizado en español para una persona con las siguientes características:

Edad: ${profile.age} años
Altura: ${profile.height} cm
Peso: ${profile.weight} kg
Género: ${profile.gender}
Nivel de fitness: ${profile.fitnessLevel}
Objetivo: ${profile.goal}
Días disponibles por semana: ${profile.availableDays}
Equipamiento disponible: ${profile.equipment}

El plan debe incluir:
1. Un título atractivo
2. Una descripción general del plan
3. Un programa semanal detallado con:
   - Enfoque del día
   - Ejercicios específicos con series, repeticiones y descansos
   - Una frase motivacional para cada día
   - Un consejo práctico del día
4. Notas generales sobre nutrición y recuperación
5. Una frase motivacional general
6. Un consejo del día general

IMPORTANTE: Debes responder SOLO con un objeto JSON válido que siga exactamente esta estructura:
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
  "generalNotes": "string",
  "motivationalQuote": "string",
  "dailyTip": "string"
}

No incluyas ningún texto adicional antes o después del JSON.`;
  }

  private parseResponse(response: any): WorkoutPlan {
    try {
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error('Error al procesar la respuesta del servidor.');
    }
  }

  private validateWorkoutPlan(plan: WorkoutPlan): void {
    if (!plan.title || !plan.description || !plan.weeklySchedule) {
      throw new Error('El plan de entrenamiento generado no es válido.');
    }

    plan.weeklySchedule.forEach(day => {
      if (!day.exercises || day.exercises.length === 0) {
        throw new Error('Cada día debe tener al menos un ejercicio.');
      }
    });
  }
} 