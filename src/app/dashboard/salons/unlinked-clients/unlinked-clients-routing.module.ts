import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnlinkedClientsInfoComponent } from './unlinked-clients-info/unlinked-clients-info.component';
import { UnlinkedClientsListComponent } from './unlinked-clients-list/unlinked-clients-list.component';
import { UnlinkedClientsModule } from './unlinked-clients.module';


const routes: Routes = [
  {
    path: '', component: UnlinkedClientsListComponent},
    { path: ':client_id/information', component: UnlinkedClientsInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnlinkedClientsRoutingModule { }
