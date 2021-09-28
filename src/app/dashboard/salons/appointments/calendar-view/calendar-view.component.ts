import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent, CalendarView } from 'angular-calendar';
import { addMonths, isSameDay, isSameMonth, subMonths } from 'date-fns';
import { Subject } from 'rxjs';
import { ServiceResponse } from 'src/utils/enums';
import { AppointmentFilterComponent } from '../appointment-filter/appointment-filter.component';
import { CalendarListResponse, CalendarAppointments } from '../appointment.model';
import { AppointmentService } from '../appointment.service';

const colors: any = {
    cancelled: {
        primary: 'rgba(239, 86, 78, 0.5)'
    },
    confirmed: {
        primary: 'rgba(171, 237, 221, 0.5)'
    },
    fulfilled: {
        primary: 'rgba(110, 212, 0, 0.5)'
    },
};

@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    @ViewChild(MatButton, { static: false }) button: MatButton;

    minDate: Date = subMonths(new Date(), 1);

    maxDate: Date = addMonths(new Date(), 1);
    calendarList: CalendarListResponse;
    calendarAppointment: CalendarAppointments[]
    salonId = null;
    serviceId = null;
    service = null;
    isEmptyList = false;
    searchString = "";
    activeDayIsOpen = true;
    isCalendarApiLoading = false;
    clickedDate
    state = "";
    status = "";
    currentPage = 1;
    totalEvents: any[] = []
    //calendar events
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    //modal data
    modalData: {
        action: string;
        event: CalendarEvent;
    };
    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [
    ];
    excludeDays: number[] = [];

    constructor(
        public modal: NgbModal,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public router: Router,
        private appointmentService: AppointmentService

    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.updatedDate(this.viewDate);
        this.getCalendarData();
    }

    getCalendarData() {
        this.isCalendarApiLoading = true;
        this.appointmentService.calendarListService(this.salonId, this.clickedDate, this.serviceId, this.status, (status, response) => {
            if (status === ServiceResponse.success) {
                this.calendarList = response;
                this.calendarAppointment = this.calendarList.appointments;
                this.isCalendarApiLoading = false;
                this.calendarAppointment.forEach((item) => {
                    this.events.push({
                        id: item.appointment_id,
                        start: new Date(item.start),
                        title: item.client_name + ',' + item.time,
                        color: this.setEventColor(item.status),
                    }
                    )
                })
            } else if (status === ServiceResponse.emptyList) {
                this.isEmptyList = true
            }
        })
    }
    setEventColor(status) {
        return status === 'Cancelled' ? colors.cancelled.primary : status === 'Confirmed' ? colors.confirmed.primary : colors.fulfilled.primary
    }

    onClickNextMonth(viewDate) {
        this.closeOpenMonthViewDay(viewDate);
        this.getCalendarData();
    }

    onClickPreviousMonth(viewDate) {
        this.closeOpenMonthViewDay(viewDate);
        this.getCalendarData();
    }
    closeOpenMonthViewDay(viewDate) {
        this.activeDayIsOpen = false;
        this.updatedDate(viewDate)
    }
    updatedDate(viewDate) {
        var date = new Date(viewDate),
            month = ("0" + (date.getMonth() + 1)).slice(-2);
        this.clickedDate = [date.getFullYear(), month].join("/");
        return this.clickedDate;
    }

    openFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let dialogref = this.dialog.open(AppointmentFilterComponent, {
            width: "330px",
            panelClass: "filter-dialog",
            position: { right: right + 'px', top: top + 'px' },
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                salonId: this.salonId,
                status: this.status,
                service: this.service,
                searchString: this.searchString,
            },
        });
        dialogref.afterClosed().subscribe((response) => {
            if (response !== undefined) {
                this.status = response.status;
                this.currentPage = 1;
                this.service = response.service;
                this.appointmentService.calendarListService(this.salonId, this.clickedDate, this.serviceId, this.status, (status, response) => {
                    if (status === ServiceResponse.success) {
                        this.calendarList = response;
                        this.calendarAppointment = this.calendarList.appointments;
                        this.isCalendarApiLoading = false;
                        this.events = [];
                        this.calendarAppointment.forEach((item) => {
                            this.events.push({
                                id: item.appointment_id,
                                start: new Date(item.start),
                                title: item.client_name + ',' + item.time,
                                color: this.setEventColor(item.status),
                            }
                            )
                        })
                    } else if (status === ServiceResponse.emptyList) {
                        this.isEmptyList = true
                    }
                })
            }
        })
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
        this.activeDayIsOpen = false
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd,
    }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map((iEvent) => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event, '');
    }

    handleEvent(action: string, event: CalendarEvent, string): void {
        if (string === '' && string === undefined && string === null) { }
        else {
            this.showMore(string)
            this.modalData = { event, action };
            this.modal.open(this.modalContent, { size: 'lg' });
        }
    }

    public segmentIsValid(date: Date) {
        return date.getHours() >= 10 && date.getHours() <= 17;
    }

    beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
        renderEvent.body.forEach((day) => {
            const dayOfMonth = day.date.getDate();

            if (dayOfMonth) {
                day.cssClass = 'pointer-event';
            }
            if (day.isToday) {
                day.cssClass = 'month-grid-active';
            }
            if (day.isPast || day.isFuture) {
                day.cssClass = 'pointer-event';
            }

        });
    }

    onClickMonthGrid(day) {
        let currentDate = new Date(new Date()),
            currentDay = ("0" + currentDate.getDate()).slice(-2),
            activeDay = ("0" + day.date.getDate()).slice(-2);
        if (day.isToday || +activeDay == +currentDay + 1 || +activeDay == +currentDay + 2) {
            this.navigateTo()
        }
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    showMore(e) {
        this.totalEvents = this.events.filter(x => new Date(x.start).toLocaleDateString().slice(0, 10) == new Date(e.date).toLocaleDateString().slice(0, 10) ||
            new Date(x.end).toLocaleDateString().slice(0, 10) == new Date(e.date).toLocaleDateString().slice(0, 10))
    }

    navigateTo() {
        this.router.navigate(["/home/salons/salon/" + this.salonId + "/appointments/create"]);
    }

}
