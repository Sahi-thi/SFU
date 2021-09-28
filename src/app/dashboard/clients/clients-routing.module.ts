import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsDashboardComponent } from './clients-dashboard/clients-dashboard.component';
import { ClientsFilterComponent } from './clients-filter/clients-filter.component';
import { ClientsFormsListComponent } from './clients-forms-list/clients-forms-list.component';
import { ClientsInfoComponent } from './clients-info/clients-info.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { ClientsRoutineComponent } from './clients-routine/clients-routine.component';
import { ClientsSalonsLinkedComponent } from './clients-salons-linked/clients-salons-linked.component';

const routes: Routes = [
    {
        path: '',
        component: ClientsListComponent,
    },
    {
        path: '', component: ClientsDashboardComponent,
        children: [
            { path: ':client_id/information', component: ClientsInfoComponent },
            { path: ':client_id/routine', component: ClientsRoutineComponent },
            { path: ':client_id/signed-forms', component: ClientsFormsListComponent },
            { path: ':client_id/salons-linked', component: ClientsSalonsLinkedComponent },
        ]
    },
    { path: 'filter', component: ClientsFilterComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientsRoutingModule { }
