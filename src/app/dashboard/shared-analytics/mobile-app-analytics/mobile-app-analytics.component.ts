import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarView } from 'angular-calendar';
import { Label } from 'aws-sdk/clients/cloudhsm';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { ServiceResponse } from 'src/utils/enums';
import { SharedAnalyticService } from '../shared-analytic.service';
import { AnalyticResponse } from '../shared-analytic.model';
import * as moment from 'moment';

@Component({
    selector: 'app-mobile-app-analytics',
    templateUrl: './mobile-app-analytics.component.html',
    styleUrls: ['./mobile-app-analytics.component.scss']
})
export class MobileAppAnalyticsComponent implements OnInit {
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    isNewUser: boolean;
    responseMessage: string;
    isChartList: boolean
    salonId = null;
    date;
    startDate;
    endDate;
    analyticResponse: AnalyticResponse;
    totalUsersCount: number;
    newUsersCount: number;
    isApiLoading = false;
    isUsersApiLoading = false;
    analytics = [
        { 'week': 'Week1' },
        { 'week': 'Week2' },
        { 'week': 'Week3' },
        { 'week': 'Week4' },

    ]
    public barChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false,
                    display: false,
                },
            }],
            yAxes: [{
                ticks: {
                    padding: 10,
                    stepSize: 0,
                },
                gridLines: {
                    drawBorder: false,
                },
            }]
        },
        tooltips: {
            backgroundColor: '#ffffff',
            bodyFontColor: 'rgba(0,0,0,0.8)',
            titleFontColor: 'rgba(0,0,0,0.8)',
            borderWidth: 0.5,
            borderColor: 'rgba(0,0,0,0.5)',
        },
    };
    public barChartLabels: Label[] = [];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];
    headerTab = '';

    public barChartData: ChartDataSets[] = [
        { data: [], maxBarThickness: 60, backgroundColor: '#8BA6B9', hoverBackgroundColor: '#8BA6B9' }
    ];

    constructor(private activatedRoute: ActivatedRoute,
        private analyticsService: SharedAnalyticService
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.getDates(this.viewDate);
        this.headerTab = localStorage.getItem('headerTab');
        this.getUserAnalyticsData();
    }

    getDates(date) {
        this.date = moment.utc(date).local().format('MMMM, yyyy');

        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        this.startDate = formatDate(firstDay, 'yyyy-MM-dd', 'en-us')
        this.endDate = formatDate(lastDay, 'yyyy-MM-dd', 'en-us')
    }

    onClickUser() {
        this.isNewUser = false;
    }

    onClickNewUser() {
        this.isNewUser = true;

    }

    onClickPreviousMonth(date) {
        this.getDates(date);
        this.getUserAnalyticsData();
    }

    onClickNextMonth(date) {
        this.getDates(date);
        this.getUserAnalyticsData();
    }

    getUserAnalyticsData() {
        this.isUsersApiLoading = true;
        this.analyticsService.userAnalyticsList(this.salonId, this.startDate, this.endDate, this.headerTab, (status, response) => {
            this.isUsersApiLoading = false;
            if (status === ServiceResponse.success) {
                this.isChartList = false;
                this.analyticResponse = response;
                const analyticResponse = this.analyticResponse.data;
                this.totalUsersCount = this.analyticResponse.total_users;
                let data = []
                this.barChartData[0].data = analyticResponse.map(item =>
                    item.count
                )
                this.barChartLabels = analyticResponse.map(item => item.week);
            }
            else if (status === ServiceResponse.emptyList) {
                this.isChartList = true;
                this.responseMessage = response.message;
                this.totalUsersCount = response.total_users;
            }

        })
    }

}
