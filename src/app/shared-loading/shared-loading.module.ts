import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsLoadingComponent } from './cards-loading/cards-loading.component';
import { ListLoadingComponent } from './list-loading/list-loading.component';
import { TableLoadingComponent } from './table-loading/table-loading.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const CommonArray = [CardsLoadingComponent, ListLoadingComponent, TableLoadingComponent]
@NgModule({
    declarations: [...CommonArray],
    imports: [
        CommonModule,
        NgxSkeletonLoaderModule
    ],
    exports: [...CommonArray]
})
export class SharedLoadingModule { }
