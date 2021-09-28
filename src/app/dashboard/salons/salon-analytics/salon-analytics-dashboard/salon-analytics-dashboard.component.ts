import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Constants } from 'src/utils/constants';

@Component({
  selector: 'app-salon-analytics-dashboard',
  templateUrl: './salon-analytics-dashboard.component.html',
  styleUrls: ['./salon-analytics-dashboard.component.scss']
})
export class SalonAnalyticsDashboardComponent implements OnInit {

  constructor(private titleService :Title) { }

  ngOnInit() {
    this.titleService.setTitle(Constants.skinForYou + 'Analytics');
  }

}
