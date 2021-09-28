import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-form-view-dialog',
  templateUrl: './form-view-dialog.component.html',
  styleUrls: ['./form-view-dialog.component.scss']
})
export class FormViewDialogComponent implements OnInit {

  fileName = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<FormViewDialogComponent>,
  ) { }

  ngOnInit() {
    this.fileName = this.data.src;
  }

}
