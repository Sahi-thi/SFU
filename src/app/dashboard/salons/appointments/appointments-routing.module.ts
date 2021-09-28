import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentCreateComponent } from './appointment-create/appointment-create.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { TableViewComponent } from './table-view/table-view.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { UnregisteredClientsAppointmentListComponent } from './unregistered-clients-appointment-list/unregistered-clients-appointment-list.component';

const routes: Routes = [
    // { path: '', component: TableViewComponent },
    { path: '', redirectTo: 'registered-users' },
    { path: 'registered-users', component: TableViewComponent },
    { path: 'unregistered-users', component: UnregisteredClientsAppointmentListComponent },
    { path: 'registered-users/calendar-view', component: CalendarViewComponent },
    { path: 'registered-users/create', component: AppointmentCreateComponent },
    { path: 'unregistered-users/create', component: AppointmentCreateComponent },
    { path: 'registered-users/:id/details', component: AppointmentDetailsComponent },
    { path: 'unregistered-users/:id/details', component: AppointmentDetailsComponent },
    { path: 'registered-users/:appointment_id/edit', component: AppointmentCreateComponent },
    { path: 'unregistered-users/:appointment_id/edit', component: AppointmentCreateComponent },
    { path: '', pathMatch: 'full', component: TableViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
