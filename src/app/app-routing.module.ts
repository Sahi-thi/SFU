import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPreloadingStrategy } from './preloading';
const routes: Routes = [

    {
        path: '',
        data: { preload: true },
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    },

    {
        path: 'home',
        loadChildren: () =>
            import('./dashboard/dashboard.module').then((m) => m.DashboardModule),

    },
    {
        path: 'forms',
        loadChildren: () =>
            import('./client-forms/client-forms.module').then(
                (m) => m.ClientFormsModule
            ),
    },

];

@NgModule({
    providers: [AppPreloadingStrategy],
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: AppPreloadingStrategy,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
