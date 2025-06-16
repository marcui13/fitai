import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/core/models/user-profile.model';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.page.html',
  styleUrls: ['./workout-form.page.scss'],
  standalone: false
})
export class WorkoutFormPage implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      gender: ['', Validators.required],
      fitnessLevel: ['', Validators.required],
      goal: ['', Validators.required],
      availableDays: [3, Validators.required],
      equipment: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const profile: UserProfile = {
        ...this.form.value,
        bmi: this.calculateBMI()
      };
      
      // Navigate to results page with profile data
      this.router.navigate(['/workout-result'], {
        state: { profile }
      });
    }
  }

  private calculateBMI(): number {
    const height = this.form.get('height')?.value / 100; // Convert to meters
    const weight = this.form.get('weight')?.value;
    
    if (height && weight) {
      return weight / (height * height);
    }
    return 0;
  }
} 