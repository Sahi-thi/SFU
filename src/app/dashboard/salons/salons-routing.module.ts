import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalonInformationComponent } from './salon-information/salon-information.component';
import { SalonDashboardComponent } from './salon-dashboard/salon-dashboard.component';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { AddProvidersComponent } from './add-providers/add-providers.component';
import { AddSalonComponent } from '../shared-salon/add-salon/add-salon.component';
import { InviteUserListComponent } from './invite-user-list/invite-user-list.component';

const routes: Routes = [

    {
        path: '', component: SalonDashboardComponent,
        children: [
            { path: ':salon_id/details', component: SalonInformationComponent },
            { path: ':salon_id/details/edit', component: AddSalonComponent },
            { path: ':salon_id/providers', component: ProvidersListComponent },
            { path: ':salon_id/providers/add', component: AddProvidersComponent },
            { path: ':salon_id/providers/:provider_id/details', component: AddProvidersComponent },
            { path: ':salon_id/providers/:provider_id/edit', component: AddProvidersComponent },
            { path: ':salon_id/invite-users/list', component: InviteUserListComponent },

            {
                path: ':salon_id/clients',
                loadChildren: () => import('./salon-clients/salon-clients.module').then(m => m.SalonClientsModule),
                data: { preload: true }
            },
            {
                path: ':salon_id/brands',
                loadChildren: () => import('./salon-product-lines/salon-product-lines.module').then(m => m.SalonProductLinesModule),
                data: { preload: true }
            },
            {
                path: ':salon_id/services',
                loadChildren: () => import('./salon-services/services.module').then(m => m.ServicesModule),
                data: { preload: true }
            },
            {
                path: ':salon_id/recommendations',
                loadChildren: () => import('./recommendations/recommendations.module').then(m => m.RecommendationsModule),
                data: { preload: true }
            },
            {
                path: ':salon_id/appointments',
                loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule),
                data: { preload: true }
            },
            // {
            //     path: ':salon_id/rewards',
            //     loadChildren: () => import('./rewards/rewards.module').then(m => m.RewardsModule),
            //     data: { preload: true }
            // },
            {
                path: ':salon_id/analytics',
                loadChildren: () => import('./salon-analytics/salon-analytics.module').then(m => m.SalonAnalyticsModule),
                data: { preload: true }
            },
            {
                path: ':salon_id/conversations',
                loadChildren: () => import('./conversations/conversations.module').then(m => m.ConversationsModule),
                data: { preload: true }
            },
            // {
            //     path: ':salon_id/unlinkedClients',
            //     loadChildren: () => import('./unlinked-clients/unlinked-clients.module').then(m => m.UnlinkedClientsModule),
            //     data: { preload: true }
            // },
            {
                path: ':salon_id/promotional-messages',
                loadChildren: () => import('./promotional-messages/promotional-message.module').then(m => m.PromotionalMessageModule),
                data: { preload: true }
            },

        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalonsRoutingModule { }
