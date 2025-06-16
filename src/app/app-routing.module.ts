import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'workout-form', pathMatch: 'full' },
  { path: 'workout-form', loadChildren: () => import('./features/workout-form/workout-form.module').then(m => m.WorkoutFormPageModule) },
  { path: 'workout-result', loadChildren: () => import('./features/workout-result/workout-result.module').then(m => m.WorkoutResultPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
