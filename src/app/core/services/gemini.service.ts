import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile } from '../models/user-profile.model';
import { WorkoutPlan } from './open-ai.service';
import { environment } from '../../../.env/environment';

import { HistoryService } from './history.service';
import { AIModelService } from './ai-model.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(
    private http: HttpClient,
    private historyService: HistoryService,
    private aiModelService: AIModelService
  ) {}

  generateWorkoutPlan(profile: UserProfile): Observable<WorkoutPlan> {
    const prompt = this.createPrompt(profile);

    return this.http.post(`${this.GEMINI_API_URL}?key=${environment.geminiApiKey}`, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }).pipe(
      map((response: any) => {
        try {
          const content = response.candidates[0].content.parts[0].text;
          // Limpiamos el contenido antes de parsearlo
          const cleanedContent = this.cleanJsonContent(content);
          const workoutPlan = JSON.parse(cleanedContent);
          this.validateWorkoutPlan(workoutPlan);
          
          // Guardar en el historial
          this.historyService.addToHistory(profile, workoutPlan, 'gemini');
          
          return workoutPlan;
        } catch (error) {
          console.error('Error parsing Gemini response:', error);
          console.error('Original content:', response.candidates[0].content.parts[0].text);
          throw new Error('Error al procesar la respuesta del servidor.');
        }
      })
    );
  }

  private cleanJsonContent(content: string): string {
    try {
      // Primero intentamos parsear directamente
      JSON.parse(content);
      return content;
    } catch {
      // Si falla, intentamos limpiar el contenido
      try {
        // Encontramos el primer { y el último }
        const startIndex = content.indexOf('{');
        const endIndex = content.lastIndexOf('}') + 1;
        
        if (startIndex === -1 || endIndex === 0) {
          throw new Error('No se encontró un objeto JSON válido');
        }

        // Extraemos solo el contenido entre { y }
        let cleaned = content.substring(startIndex, endIndex);
        
        // Reemplazamos saltos de línea dentro de strings por espacios
        cleaned = cleaned.replace(/"([^"]*)\\n([^"]*)"/g, '"$1 $2"');
        
        // Verificamos que el JSON sea válido
        JSON.parse(cleaned);
        return cleaned;
      } catch {
        // Si aún falla, intentamos una limpieza más agresiva
        const startIndex = content.indexOf('{');
        const endIndex = content.lastIndexOf('}') + 1;
        
        if (startIndex === -1 || endIndex === 0) {
          throw new Error('No se encontró un objeto JSON válido');
        }

        return content
          .substring(startIndex, endIndex)
          .replace(/\n/g, ' ')    // Reemplazamos todos los saltos de línea por espacios
          .replace(/\s+/g, ' ')   // Reemplazamos múltiples espacios por uno solo
          .trim();                // Eliminamos espacios al inicio y final
      }
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

IMPORTANTE: 
- Debes responder SOLO con un objeto JSON válido que siga exactamente esta estructura
- NO uses saltos de línea dentro de los strings
- NO incluyas ningún texto adicional antes o después del JSON
- NO incluyas la palabra 'json' al inicio de la respuesta
- Asegúrate de que el JSON esté completo y bien formado

Estructura del JSON:
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
}`;
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