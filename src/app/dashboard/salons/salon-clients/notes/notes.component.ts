import { Component, OnInit, ViewChild } from '@angular/core';
import { MetaData, NotesData, NotesResponse } from '../salon-clients.model';
import { SalonClientsService } from '../salon-clients.service';
import { ServiceResponse } from '../../../../../utils/enums';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Subject, Observable, Subscription } from 'rxjs';
import { MatButton, MatDialog } from '@angular/material';
import { DeleteNoteComponent } from '../delete-note/delete-note.component';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
    @ViewChild(MatButton, { static: false }) button: MatButton;

    notesDataSource: NotesDataSource;
    notesResponse: NotesResponse;
    notes: NotesData[];
    notesDataSub: Subscription;
    notesLoaderSub: Subscription;
    notesEmptySub: Subscription;
    currentPage = 1;
    clientId = null;
    salonId = null;
    offset = 5;
    isNotesEmpty = false;
    isLoadingAPI = false;
    metaData: MetaData;

    constructor(
        public salonClientsService: SalonClientsService,
        public dialog: MatDialog,

    ) { }

    ngOnInit() {
        this.getNotesData();
        this.subscribeData();
    }

    getNotesData() {
        this.clientId = + localStorage.getItem("client_id");
        this.salonId = + localStorage.getItem("salon_id");
        this.notesDataSource = new NotesDataSource(this.salonClientsService);
        this.notesDataSource.getNotesService(this.salonId, this.clientId, this.offset, this.currentPage);
    }

    onClickCard() {
        localStorage.setItem('navigationFrom', 'list');
    }

    onClickEdit(event) {
        event.stopPropagation();
        localStorage.setItem('navigationFrom', 'edit');
    }

    onClickAddNote() {
        localStorage.setItem('navigationFrom', 'add');
    }

    onClickDeleteNote(noteId, event) {
        event.stopPropagation();
        let dialogref = this.dialog.open(DeleteNoteComponent, {
            width: "340px",
            hasBackdrop: true,
            data: {
                note_id: noteId,
                client_id: this.clientId,
                salon_id: this.salonId
            }

        });
        dialogref.afterClosed().subscribe(response => {
            if (response !== undefined) {
                console.log(this.currentPage, this.notes.length);
                this.currentPage = this.notes.length === 1 && this.currentPage !== 1 ? this.currentPage - 1 : this.currentPage
                this.notesDataSource.getNotesService(this.salonId, this.clientId, this.offset, this.currentPage);
            }
        })
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.notesDataSource.getNotesService(this.salonId, this.clientId, this.offset, this.currentPage);
    }

    subscribeData() {
        this.notesDataSub = this.notesDataSource.observeNotesResponse.subscribe(usersListData => {
            this.notesResponse = usersListData;
            this.notes = this.notesResponse.notes;
            this.metaData = this.notesResponse.meta_data;
        });

        this.notesLoaderSub = this.notesDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.notesEmptySub = this.notesDataSource.observeNotesEmpty.subscribe(isListEmpty => {
            this.isNotesEmpty = isListEmpty;
        });
    }

    ngOnDestroy() {
        if (!!this.notesDataSub) this.notesDataSub.unsubscribe();
        if (!!this.notesLoaderSub) this.notesLoaderSub.unsubscribe();
        if (!!this.notesEmptySub) this.notesEmptySub.unsubscribe();
    }

}

export class NotesDataSource extends DataSource<NotesData> {
    private observeNotes = new BehaviorSubject<NotesData[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeNotesEmpty = new BehaviorSubject<boolean>(false);
    public observeNotesResponse = new Subject<NotesResponse>();

    constructor(public salonClientsService: SalonClientsService) {
        super();
    }

    getNotesService(salonId: number, clientId: number, offset: number, page: number) {

        this.observeLoader.next(true);
        this.salonClientsService.NotesListService(salonId, clientId, offset, page, (status, response) => {
            this.observeLoader.next(false);

            if (status === ServiceResponse.success) {
                this.observeNotesEmpty.next(false);
                this.observeNotesResponse.next(response);
                this.observeNotes.next(response.notes);
            } else if (status === ServiceResponse.emptyList) {
                this.observeNotesResponse.next(new NotesResponse());
                this.observeNotes.next(new Array<NotesData>());
                this.observeNotesEmpty.next(true);
            } else {
                this.observeNotesEmpty.next(true);
            }

        });
    }

    connect(collectionViewer: CollectionViewer): Observable<NotesData[]> {
        return this.observeNotes.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

}
