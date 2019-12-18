import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { ProjectListComponent } from './project-list/project-list.component'
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';

const appRoutes: Routes = [
  { path: 'timesheets', component: TimesheetListComponent},
  { path: 'projects', component: ProjectListComponent },
  { path: '', redirectTo: '/timesheets', pathMatch: 'full'}
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
