import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
    selector: 'app-delete-service-product-dialog',
    templateUrl: './delete-service-product-dialog.component.html',
    styleUrls: ['./delete-service-product-dialog.component.scss']
})
export class DeleteServiceProductDialogComponent implements OnInit {
    listId: number;
    listType: string;
    listTitle: string;
    isApiLoading: boolean
    isDeleted: boolean;
    responseMessage = ''
    constructor(
        private dashboardService: DashboardService,
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<DeleteServiceProductDialogComponent>,
    ) { }

    ngOnInit() {
        this.listId = this.data.listId;
        this.listTitle = this.data.listTitle
        this.listType = this.data.listType;
        console.log(this.data);

    }

    deleteListItem() {
        this.isApiLoading = true;
        this.dialogRef.close(
            {
                listId: this.data.listId,
            });
    }

}
