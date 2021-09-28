import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarView } from 'angular-calendar';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { ServiceResponse } from 'src/utils/enums';
import { AnalyticResponse } from '../shared-analytic.model';
import { SharedAnalyticService } from '../shared-analytic.service';

@Component({
    selector: 'app-sales-analytics',
    templateUrl: './sales-analytics.component.html',
    styleUrls: ['./sales-analytics.component.scss']
})
export class SalesAnalyticsComponent implements OnInit {
    isServices: boolean;
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    isNewUser: boolean;
    salonId = null;
    isChartList: boolean;
    responseMessage: string;
    productsData: AnalyticResponse;
    serviceData: AnalyticResponse;
    startDate;
    endDate;
    isServiceApiLoading = false;
    isApiLoading = false;
    productsCount = null;
    servicesCount = null
    headerTab = '';

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
                    beginAtZero: true,
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
    public barChartLabels: Label[] = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];
    public barChartData: ChartDataSets[] = [
        { data: [], maxBarThickness: 60, backgroundColor: '#8BA6B9', hoverBackgroundColor: '#8BA6B9' }
    ];
    date;
    constructor(private activatedRoute: ActivatedRoute,
        private analyticsService: SharedAnalyticService) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.headerTab = localStorage.getItem('headerTab');
        this.getDates(this.viewDate)

        this.getserviceAnalyticsData();
        this.getproductAnalyticsData();
    }
    onClickProductsTab() {
        if (this.isServices === true) {

            this.getproductAnalyticsData();
            this.isServices = false;
        }

    }
    getDates(date) {
        this.date = moment.utc(date).local().format('MMMM, yyyy');

        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        this.startDate = formatDate(firstDay, 'yyyy-MM-dd', 'en-us');
        this.endDate = formatDate(lastDay, 'yyyy-MM-dd', 'en-us');
    }
    onClickServicesTab() {
        if (this.isServices === false || this.isServices === undefined) {
            this.isServices = true;
            this.getserviceAnalyticsData();
        }
    }

    onClickPreviousMonth(date) {

        this.getDates(date);
        this.getserviceAnalyticsData();
        this.getproductAnalyticsData();
    }

    onClickNextMonth(date) {
        this.getDates(date);
        this.getserviceAnalyticsData();
        this.getproductAnalyticsData();
    }

    getproductAnalyticsData() {
        this.isServiceApiLoading = true;
        this.analyticsService.productAnalyticsList(this.salonId, this.startDate, this.endDate, this.headerTab, (status, response) => {
            this.isServiceApiLoading = false;
            if (status === ServiceResponse.success) {
                this.isChartList = false;
                this.productsData = response;
                this.barChartData[0].data = this.productsData.data.map(item => item.count)
                this.barChartLabels = this.productsData.data.map(item => item.week);
                this.productsCount = this.productsData.total_products;
            } else if (status === ServiceResponse.emptyList) {
                this.isChartList = true;
                this.responseMessage = response.message;
                this.productsCount = response.total_products;
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    getserviceAnalyticsData() {
        this.isApiLoading = true;

        this.analyticsService.serviceAnalyticsList(this.salonId, this.startDate, this.endDate, this.headerTab, (status, response) => {
            this.isApiLoading = false;
            if (status === ServiceResponse.success) {
                this.isChartList = false;
                this.serviceData = response;
                this.barChartData[0].data = this.serviceData.data.map(item => item.count);
                this.barChartLabels = this.serviceData.data.map(item => item.week);
                this.servicesCount = this.serviceData.total_services;
            } else if (status === ServiceResponse.emptyList) {
                this.isChartList = true;
                this.responseMessage = response.message;
                this.servicesCount = response.total_services;
            } else {
                this.responseMessage = response.message;
            }
        })
    }

}
