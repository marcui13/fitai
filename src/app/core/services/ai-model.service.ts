import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AIModel = 'gemini' | 'openai';

@Injectable({
  providedIn: 'root'
})
export class AIModelService {
  private readonly STORAGE_KEY = 'selected_ai_model';
  private modelSubject = new BehaviorSubject<AIModel>('gemini');
  public model$ = this.modelSubject.asObservable();

  constructor() {
    this.loadModel();
  }

  private loadModel() {
    const storedModel = localStorage.getItem(this.STORAGE_KEY);
    if (storedModel) {
      this.modelSubject.next(storedModel as AIModel);
    }
  }

  setModel(model: AIModel) {
    this.modelSubject.next(model);
    localStorage.setItem(this.STORAGE_KEY, model);
  }

  getCurrentModel(): AIModel {
    return this.modelSubject.value;
  }
} 