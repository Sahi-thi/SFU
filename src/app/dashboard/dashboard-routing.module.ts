import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardGuardService } from './dashboard-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalonsListComponent } from './salons-list/salons-list.component';
import { AddSalonComponent } from './shared-salon/add-salon/add-salon.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,

        children: [

            { path: '', redirectTo: 'salons', canActivate: [DashBoardGuardService], },
            {
                path: 'salons', component: SalonsListComponent, canActivate: [DashBoardGuardService],
                data: { role: 'SA' }
            },
            { path: 'salons/add', component: AddSalonComponent, canActivate: [DashBoardGuardService], },
            { path: 'salons/:salon_id/edit', component: AddSalonComponent, canActivate: [DashBoardGuardService], },
            {
                path: 'salons/salon',
                loadChildren: () => import('./salons/salons.module').then(m => m.SalonsModule),
                canActivate: [DashBoardGuardService],
            },
            {
                path: 'brands',
                loadChildren: () => import('./product-lines/product-lines.module').then(m => m.ProductLinesModule),
                canActivate: [DashBoardGuardService],
                data: {
                    preload: true,
                    role: 'SA'
                }
            },
            {
                path: 'over-view-analytics',
                loadChildren: () => import('./over-view-analytics/over-view-analytics.module').then(m => m.OverViewAnalyticsModule),
                canActivate: [DashBoardGuardService],
                data: { preload: true, role: 'SA' }
            },
            {
                path: 'allClients',
                loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule),
                canActivate: [DashBoardGuardService],
                data: { preload: true, role: 'SA' }
            },
            {
                path: 'daily-words-of-wisdom',
                loadChildren: () => import('./daily-words/daily-words.module').then(m => m.DailyWordsModule),
                canActivate: [DashBoardGuardService],
                data: { preload: true, role: 'SA' }
            },
            {
                path: 'ingredients',
                loadChildren: () => import('./ingredients/ingredients.module').then(m => m.IngredientsModule),
                canActivate: [DashBoardGuardService],
                data: { preload: true, role: 'SA' }
            }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
