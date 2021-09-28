import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


interface Status {
  id: string;
  value: string;
}

@Component({
  selector: 'app-salon-clients-filter',
  templateUrl: './salon-clients-filter.component.html',
  styleUrls: ['./salon-clients-filter.component.scss']
})
export class SalonClientsFilterComponent implements OnInit {

  statuses: Status[] = [
    {id: 'Active', value: 'Active'},
    {id: 'Inactive', value: 'Inactive'}
  ];
  selectedStatus = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<SalonClientsFilterComponent>,
  ) { }

  ngOnInit() {
    this.selectedStatus = this.data.selectedStatus;
    }

  applyFilter() {
    this.dialogRef.close(
        {
            status: this.selectedStatus,
            searchString: this.data.searchString
        }
    )
}
removeFilterData() {
    this.dialogRef.close(
        {
            status: "",
            searchString: this.data.searchString
        }
    )
}

}
