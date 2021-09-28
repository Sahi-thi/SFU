import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatDialogModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ChatCreateDialogComponent } from './chat-create-dialog/chat-create-dialog.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { ConversationsRoutingModule } from './conversations-routing.module';
import { ConversationsComponent } from './conversations.component';
import { ConversationsService } from './conversations.service';
import { DateAgoPipe } from './date-ago.pipe';
import { DateTimePipe } from './date-time.pipe';
import { DialogService } from './dialog.service';
import { MessageItemComponent } from './message-item/message-item.component';
import { MessageService } from './message.service';
import { QBHelper } from './quickblox/helpers/qbHelper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SanitizeUrlPipe } from './sanitize-url.pipe';

@NgModule({
    declarations: [
        ConversationsComponent,
        ChatListComponent,
        ChatMessagesComponent,
        ChatCreateDialogComponent,
        DateAgoPipe,
        MessageItemComponent,
        DateTimePipe,
        SanitizeUrlPipe
    ],
    imports: [
        CommonModule,
        ConversationsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatButtonModule,
        InfiniteScrollModule,
        MatSnackBarModule
    ],
    providers: [
        QBHelper,
        DialogService,
        MessageService,
        ConversationsService
    ],
    entryComponents: [ChatCreateDialogComponent],
})
export class ConversationsModule { }
