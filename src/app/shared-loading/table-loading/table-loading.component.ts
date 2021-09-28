import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-table-loading',
    templateUrl: './table-loading.component.html',
    styleUrls: ['./table-loading.component.scss']
})
export class TableLoadingComponent implements OnInit {
    @Input() skeletonHead: any;
    @Input() skeletonColumn: any;
    @Input() isAvatar: any;
    @Input() isEditDelete: any;

    constructor() { }

    ngOnInit() {
    }

}
