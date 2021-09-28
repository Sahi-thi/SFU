import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { Label } from 'aws-sdk/clients/cloudhsm';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { ServiceResponse } from 'src/utils/enums';
import { AnalyticResponse } from '../../shared-analytics/shared-analytic.model';
import { SharedAnalyticService } from '../../shared-analytics/shared-analytic.service';

@Component({
    selector: 'app-appointment-analytics',
    templateUrl: './appointment-analytics.component.html',
    styleUrls: ['./appointment-analytics.component.scss']
})
export class AppointmentAnalyticsComponent implements OnInit {
    startDate;
    endDate;
    date;
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    isApiLoading: boolean;
    responseMessage: string;
    appointmentData: AnalyticResponse;
    appointmentCount = null;
    isChartList: boolean;

    constructor(protected analyticsService: SharedAnalyticService) { }

    ngOnInit() {
        this.getDates(this.viewDate);
        this.getAppointmentAnalyticsData();
    }

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
                    stepSize: 5,
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
    public barChartLabels: Label[] = ['Week1', 'Week 2', 'Week3', 'Week4', 'Week 5'];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];

    public barChartData: ChartDataSets[] = [
        { data: [28, 60, 50, 70, 40], maxBarThickness: 60, backgroundColor: '#8BA6B9', hoverBackgroundColor: '#8BA6B9' }
    ];
    getDates(date) {
        this.date = moment.utc(date).local().format('MMMM, yyyy');
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        this.startDate = moment.utc(firstDay).local().format('yyyy-MM-DD');
        this.endDate = moment.utc(lastDay).local().format('yyyy-MM-DD');

    }
    onClickPreviousMonth(date) {
        this.getDates(date);
        this.getAppointmentAnalyticsData();
    }

    onClickNextMonth(date) {
        this.getDates(date);
        this.getAppointmentAnalyticsData();
    }

    getAppointmentAnalyticsData() {
        this.isApiLoading = true;
        this.analyticsService.overallAppointmentAnalyticsList(this.startDate, this.endDate, (status, response) => {
            this.isApiLoading = false;
            if (status === ServiceResponse.success) {
                this.isChartList = false;
                this.appointmentData = response;
                this.barChartData[0].data = this.appointmentData.data.map(item => item.count);
                this.barChartLabels = this.appointmentData.data.map(item => item.week);
                this.appointmentCount = this.appointmentData.total_appointments;
            } else if (status === ServiceResponse.emptyList) {
                this.isChartList = true;
                this.responseMessage = response.message;
                this.appointmentCount = response.total_appointments;
            } else {
                this.responseMessage = response.message;
            }
        })
    }
}
