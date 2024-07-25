import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalenderComponent } from './calender/calender.component';

const routes: Routes = [
  { path: 'calendar', component: CalenderComponent, loadChildren: () => import('./calender/calender.module').then((m) => m.CalenderModule) },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
