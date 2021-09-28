import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RewardService } from '../reward.service';

interface Title {
  id: string;
  value: string;
}
interface Status {
  id: string;
  value: string;
}

@Component({
  selector: 'app-reward-filter',
  templateUrl: './reward-filter.component.html',
  styleUrls: ['./reward-filter.component.scss']
})
export class RewardFilterComponent implements OnInit {

  title: "";
  startDate;
  endDate;
  minDate
  status: "";
  rewardFilterFormGroup: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<RewardFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public rewardService: RewardService
  ) { }

  ngOnInit() {
  this.startDate= this.data.startDate
  this.endDate= this.data.endDate
  this.status=this.data.status;

  this.rewardFilterFormGroup =new FormGroup({
    startDate: new FormControl(this.data.startDate),
    endDate: new FormControl(this.data.endDate),
  })
}

  titles: Title[] = [
    {id: 'Reward Title_a', value: 'Reward Title_a'},
    {id: 'Reward Title_b', value: 'Reward Title_b'},
    {id: 'Reward Title_c', value: 'Reward Title_c'},
    {id: 'Reward Title_d', value: 'Reward Title_d'},
  ];

  statuses: Status[] = [
    {id: 'Active', value: 'Active'},
    {id: 'Inactive', value: 'Inactive'},
  ];
  onStartDateSlect(date){
    this.startDate = formatDate(date, 'yyyy-MM-dd', 'en-us');
    this.minDate = formatDate(date, 'yyyy-MM-dd', 'en-us');
  }
  onendDateSlect(date){
    this.endDate = formatDate(date, 'yyyy-MM-dd', 'en-us');

  }
  applyFilter() {
    this.dialogRef.close(
      {
        startDate: this.startDate,
        endDate: this.endDate,
        status: this.status
      }
    )
  }
  removeFilterData() {
    this.dialogRef.close(
      {
       
        startDate: "",
        endDate: "",
        status: ""
      }
    )
  }
}
