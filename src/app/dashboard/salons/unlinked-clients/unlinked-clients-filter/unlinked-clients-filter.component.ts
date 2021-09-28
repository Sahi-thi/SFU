import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface Status {
  id: string;
  value: string;
}
@Component({
  selector: 'app-unlinked-clients-filter',
  templateUrl: './unlinked-clients-filter.component.html',
  styleUrls: ['./unlinked-clients-filter.component.scss']
})
export class UnlinkedClientsFilterComponent implements OnInit {

  statuses: Status[] = [
    {id: 'Active', value: 'Active'},
    {id: 'Inactive', value: 'Inactive'}
  ];
  selectedStatus = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<UnlinkedClientsFilterComponent>,
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
