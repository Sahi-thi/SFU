import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalonClientsInfoComponent } from './salon-clients-info/salon-clients-info.component';
import { SalonClientsListComponent } from './salon-clients-list/salon-clients-list.component';
import { RoutineComponent } from './routine/routine.component';
import { FormsListComponent } from './forms-list/forms-list.component';
import { DetailsDashboardComponent } from './details-dashboard/details-dashboard.component';
import { NotesComponent } from './notes/notes.component';
import { AddNoteComponent } from './add-note/add-note.component';

const routes: Routes = [
    { path: '', component: SalonClientsListComponent },
    {
        path: '', component: DetailsDashboardComponent,
        children: [
            { path: ':client_id/information', component: SalonClientsInfoComponent },
            { path: ':client_id/routine', component: RoutineComponent },
            { path: ':client_id/signed-forms', component: FormsListComponent },
            { path: ':client_id/notes', component: NotesComponent },
            { path: ':client_id/notes/add', component: AddNoteComponent },
            { path: ':client_id/notes/:note_id/details', component: AddNoteComponent },
            { path: ':client_id/notes/:note_id/edit', component: AddNoteComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalonClientsRoutingModule { }
