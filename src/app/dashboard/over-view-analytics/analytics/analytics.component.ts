import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Constants } from 'src/utils/constants';

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

    constructor(
        private titleService: Title
    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + Constants.overViewAnalytics)
    }

}
