import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionalMessageAddComponent } from './promotional-message-add/promotional-message-add.component';
import { PromotionalMessagesListComponent } from './promotional-messages-list/promotional-messages-list.component';


const routes: Routes = [
  {
    path: '', component: PromotionalMessagesListComponent},
    { path: 'add', component: PromotionalMessageAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionalMessageRoutingModule { }
