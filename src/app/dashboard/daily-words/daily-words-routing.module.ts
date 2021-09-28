import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyWordsListComponent } from './daily-words-list/daily-words-list.component';
import { DailyWordsAddComponent } from './daily-words-add/daily-words-add.component';

const routes: Routes = [
    { path: '', component: DailyWordsListComponent },
    { path: 'add', component: DailyWordsAddComponent },
    { path: ':id/edit', component: DailyWordsAddComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DailyWordsRoutingModule { }
