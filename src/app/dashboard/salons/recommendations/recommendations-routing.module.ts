import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecommendationAddComponent } from './recommendation-add/recommendation-add.component';
import { RecommendationListComponent } from './recommendation-list/recommendation-list.component';
import { ServiceRecommendationComponent } from './service-recommendation/service-recommendation.component';

const routes: Routes = [
    { path: '', redirectTo: 'products' },
    { path: 'products', component: RecommendationListComponent },
    { path: 'services', component: ServiceRecommendationComponent },
    { path: 'products/add', component: RecommendationAddComponent },
    { path: 'products/edit', component: RecommendationAddComponent },
    { path: 'products/:id/details', component: RecommendationAddComponent },
    { path: 'services/add', component: RecommendationAddComponent },
    { path: 'services/edit', component: RecommendationAddComponent },
    { path: 'services/:id/details', component: RecommendationAddComponent },

    { path: 'products/:id/edit', component: RecommendationAddComponent },
    { path: 'services/:id/edit', component: RecommendationAddComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecommendationsRoutingModule { }
