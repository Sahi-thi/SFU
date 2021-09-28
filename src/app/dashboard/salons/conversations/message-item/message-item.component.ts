import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MessageService } from '../message.service';
import { DialogService } from '../dialog.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-message-item',
    templateUrl: './message-item.component.html',
    styleUrls: ['./message-item.component.scss'],
})

export class MessageItemComponent implements OnInit {

    @Input() message: any = [];
    @ViewChild('element', { static: false }) el: ElementRef;

    userId = +localStorage.getItem('quickblox_user_id');

    constructor(
        private messageService: MessageService,
        private dialogService: DialogService,
        public sanitizer: DomSanitizer
    ) { }

    ngOnInit() { }

    ngAfterViewInit() {
        if (this.message.visibilityEvent) {

            this.el.nativeElement['dataset'].messageId = this.message._id;
            this.el.nativeElement['dataset'].userId = this.message.sender_id;
            this.el.nativeElement['dataset'].dialogId = this.message.chat_dialog_id;
            this.messageService.intersectionObserver.observe(this.el.nativeElement);
        }
    }

    visibility(e) {
        this.dialogService.dialogs[e.detail.dialogId].unread_messages_count--;
        this.dialogService.dialogsEvent.emit(this.dialogService.dialogs);
        this.messageService.intersectionObserver.unobserve(this.el.nativeElement);
        this.messageService.messages = this.messageService.messages.map(
            (message) => {
                if (message._id === e.detail.messageId) {
                    message.visibilityEvent = false;
                }
                return message;
            }
        );
    }

    loadImagesEvent(e) {
        let img: any, container: Element, imgPos: number, scrollHeight: number;
        img = e.target;
        container = document.querySelector('.j-messages');
        // @ts-ignore
        imgPos = container.offsetHeight + container.scrollTop - img.offsetTop;
        scrollHeight = container.scrollTop + img.offsetHeight;

        img.classList.add('loaded');

        if (imgPos >= 0) {
            container.scrollTop = scrollHeight + 5;
        }
    }
}
