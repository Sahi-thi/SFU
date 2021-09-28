import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesListComponent } from './services-list/services-list.component';
import { ServicesAddComponent } from './services-add/services-add.component';

const routes: Routes = [
    { path: '', component: ServicesListComponent },
    { path: 'add', component: ServicesAddComponent },
    { path: ':service_id/details', component: ServicesAddComponent },
    { path: ':service_id/edit', component: ServicesAddComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServicesRoutingModule { }
