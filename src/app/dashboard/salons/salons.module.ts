import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InlineSVGModule } from 'ng-inline-svg';
import { ColorPickerModule } from 'ngx-color-picker';
import { SharedLoadingModule } from '../../shared-loading/shared-loading.module';
import { DeleteSalonComponent } from '../../shared/delete-salon/delete-salon.component';
import { SharedSalonModule } from '../shared-salon/shared-salon.module';
import { AddProvidersComponent } from './add-providers/add-providers.component';
import { InviteUserDialogComponent } from './invite-user-dialog/invite-user-dialog.component';
import { InviteUserListComponent } from './invite-user-list/invite-user-list.component';
import { ProviderServicesComponent } from './provider-services/provider-services.component';
import { ProvidersFilterComponent } from './providers-filter/providers-filter.component';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { SalonDashboardComponent } from './salon-dashboard/salon-dashboard.component';
import { SalonInformationComponent } from './salon-information/salon-information.component';
import { SalonsRoutingModule } from './salons-routing.module';
import { DateFormatePipe } from './date-formate.pipe';

@NgModule({
    declarations: [
        SalonInformationComponent,
        SalonDashboardComponent,
        ProvidersListComponent,
        AddProvidersComponent,
        ProvidersFilterComponent,
        ProviderServicesComponent,
        InviteUserListComponent,
        InviteUserDialogComponent,
        DateFormatePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        SharedSalonModule,
        SalonsRoutingModule,
        MatListModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatSelectModule,
        ColorPickerModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SharedLoadingModule,
        MatTooltipModule,
        InlineSVGModule.forRoot(),
        MatCheckboxModule,
        MatRippleModule,
    ],
    providers: [],
    entryComponents: [ProvidersFilterComponent, DeleteSalonComponent, InviteUserDialogComponent],
})
export class SalonsModule { }
