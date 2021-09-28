import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RewardCreateComponent } from './reward-create/reward-create.component';
import { RewardFilterComponent } from './reward-filter/reward-filter.component';
import { RewardsListComponent } from './rewards-list/rewards-list.component';


const routes: Routes = [
  { path: '', component: RewardsListComponent },
  { path: 'list', component: RewardsListComponent },
  { path: 'create', component: RewardCreateComponent },
  { path: ':reward_id/edit', component: RewardCreateComponent },
  { path: 'filter', component: RewardFilterComponent },
  { path: ':reward_id/details', component: RewardCreateComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardsRoutingModule { }
