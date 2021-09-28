import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ServiceResponse } from 'src/utils/enums';
import { ChatCreateDialogComponent } from '../chat-create-dialog/chat-create-dialog.component';
import { SearchUser, SearchUsersListResponse } from '../conversations.model';
import { ConversationsService } from '../conversations.service';
import { DialogService } from '../dialog.service';
import { MessageService } from '../message.service';
import { async } from '@angular/core/testing';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {

    @ViewChild(RouterOutlet, { static: false }) outlet: RouterOutlet;

    chats: Array<any> = [];
    isChatListEmpty = true;
    salonId = null;
    searchString = '';
    userList: Array<SearchUser> = [];
    isListEmpty: boolean;
    public selectedUsers: number[] = [];
    selectedChat: string;
    dialog: any;
    usersList: SearchUser[] = [];
    searchUsersListForm: FormGroup;
    isChatUsersListLoading = false;
    chatDialogQuickbloxIds = [];
    superAdminQuickbloxID;
    chatAvailableUsers = new Map();
    userRole = localStorage.getItem('userRole');
    isSearchListLoading = false;
    isCratedNewDialog = false;
    isSearchListEmpty = false;
    allUsersList: Array<any> = [];
    clientQuickBloxId = null;
    clientId = null;
    constructor(
        private formBuilder: FormBuilder,
        private conversationService: ConversationsService,
        private activatedRoute: ActivatedRoute,
        private dialogService: DialogService,
        private messageService: MessageService,
        private matDialog: MatDialog,
        private router: Router
    ) { }

    ngOnInit() {
        window.onload = (e) => {
            // console.log({ e });
            if (e.isTrusted) {
                localStorage.setItem("clientQuickBloxId", null)
                localStorage.setItem("clientId", null)
                this.clientQuickBloxId = +localStorage.getItem("clientQuickBloxId"),
                    this.clientId = +localStorage.getItem("clientId");
            }
        }

        this.activatedRoute.params.subscribe((params) => {
            // console.log({ params });
            // console.log(+localStorage.getItem('salon_id'))

            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id');
            }
        });

        this.searchUsersListForm = this.formBuilder.group({
            searchInputControl: null,
        });

        this.dialogService.dialogsEvent.subscribe((dialogsData) => {
            // console.log("dialogsData subscribe Data", dialogsData);

            this.chats = Object.values(dialogsData);
        });
        this.superAdminQuickbloxID = localStorage.getItem('sup_admin_quickblox_id')
        this.loadChatUsersList();
        this.handlingSearchUsersList();

        this.clientQuickBloxId = +localStorage.getItem("clientQuickBloxId"),
            this.clientId = +localStorage.getItem("clientId");

        // this.router.events.subscribe(e => {
        //     if (e instanceof ActivationStart && e.snapshot.outlet === "administration")
        //         this.outlet.deactivate();
        // });

    }

    ngOnDestroy(): void {

        localStorage.setItem("clientQuickBloxId", null)
        localStorage.setItem("clientId", null)
        this.clientQuickBloxId = +localStorage.getItem("clientQuickBloxId"),
            this.clientId = +localStorage.getItem("clientId");
        this.router.events.subscribe(e => {
            if (e instanceof ActivationStart && e.snapshot.outlet === "administration")
                this.outlet.deactivate();
        });
    }

    async loadChatUsersList() {
        this.isChatUsersListLoading = true;
        await this.getChatAvailableUsersData();
    }

    getChatAvailableUsersData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.conversationService.getChatAvailableUsers((status, response) => {
                if (status === ServiceResponse.success) {
                    response.forEach((element) => {
                        this.chatAvailableUsers.set(element.quickblox_id, {
                            image: element.profile_pic_thumb_url,
                            name: element.name,
                            userRole: element.user_role,
                            clientId: element.id,
                            quickbloxId: element.quickblox_id
                        });
                    });
                    resolve(true);
                } else {
                    this.chatAvailableUsers = null;
                    reject(false);
                }
                this.messageService.chatAvailableUsers = this.chatAvailableUsers;
                this.getChatList();
            });
        });
    }

    handlingSearchUsersList() {
        this.searchUsersListForm
            .get('searchInputControl')
            .valueChanges.pipe(
                debounceTime(300),
                switchMap(async (value) => {
                    this.isSearchListLoading = true;
                    const data = await this.searchUsersList(value);
                    return data;
                }),
            )
            .subscribe(
                (result: any) => {
                    this.isSearchListLoading = false;
                    this.userList = result;
                },
                (error) => {
                    this.isSearchListLoading = false;
                }
            );
    }

    displayFn(user: any) {

    }

    async getChatList() {

        let filter: any;
        const salonOwnerIds = localStorage.getItem('salon_admin_quickblox_id');
        if (this.userRole === 'SA') {
            filter = {
                limit: 100,
                sort_desc: 'updated_at',
                "occupants_ids[all]": salonOwnerIds
            };
        } else {
            filter = {
                limit: 100,
                sort_desc: 'updated_at',
            };
        }
        this.chatDialogQuickbloxIds = [];
        filter['type'] = 2;
        const result = this.conversationService.isSessionAvailable();
        if (result === null) {
            setTimeout(async () => {
                await this.getQuickBloxDialogs(filter);
            }, 6000);
        } else {
            await this.getQuickBloxDialogs(filter);
        }
    }

    getQuickBloxDialogs(filter) {
        this.dialogService
            .getDialogs(filter)
            .then((res) => {
                this.isChatUsersListLoading = false;
                if (res) {

                    res['items'].forEach((chat, index, self) => {
                        if (chat.xmpp_room_jid) {
                            this.dialogService.joinToDialog(chat);
                        }
                    });
                    if (this.userRole === 'SA') {
                        this.chats = res.items;
                        this.handleDisplayChatUsersList(this.chats);
                    } else {
                        this.chats = res.items;
                        this.handleDisplayChatUsersList(this.chats);

                    }

                    if (this.clientQuickBloxId && this.clientId) {
                        this.globalUserSelect(this.clientQuickBloxId, this.clientId)
                    }
                }

            })
            .catch((err) => {
                // console.log({ err });

                this.isChatUsersListLoading = false;
            });
    }

    handleDisplayChatUsersList(chatUsersList) {
        this.dialogService.setDialogs(this.chats);
        // console.log({ chatUsersList });

        this.allUsersList = chatUsersList;
        this.isChatListEmpty = this.allUsersList.length === 0 ? false : true

        try {
            chatUsersList.map((chatUser) => {
                // console.log({ chatUser });
                const hashMapItem = this.getOccupentUserID(chatUser.occupants_ids);
                chatUser['profile_picture'] = hashMapItem.image;
                chatUser['profile_name'] = hashMapItem.name;
                chatUser['quickblox_id'] = hashMapItem.quickbloxId;
                chatUser['client_id'] = hashMapItem.clientId;
                chatUser.last_message_date_sent = +chatUser.last_message_date_sent * 1000;
                this.storeChatDialogIds(chatUser);
            });
            console.log({ chatUsersList });
        }

        catch (error) { }

        if (chatUsersList && chatUsersList.length > 0) {
            if (this.isCratedNewDialog) {
                this.isCratedNewDialog = false;
                this.openChat(chatUsersList[0]);
            }
        }
    }

    getOccupentUserID(occupentIds) {
        if (occupentIds && occupentIds.length > 0) {
            var clientObj
            var resultObj
            occupentIds.filter((element) => {
                clientObj = this.chatAvailableUsers.get(element);
                if (clientObj && clientObj.userRole === 'C') {
                    resultObj = clientObj;
                    return resultObj;
                }
            });
            return resultObj;
        }
    }

    storeChatDialogIds(chat) {
        if (chat.occupants_ids && chat.occupants_ids.length > 0) {
            chat.occupants_ids.forEach((element) => {
                if (
                    element !== +localStorage.getItem('quickblox_user_id') &&
                    element !== +this.superAdminQuickbloxID
                ) {
                    this.chatDialogQuickbloxIds.push(element);
                }
            });
        }
    }

    async searchUsersList(searchString): Promise<any> {
        var tempList: SearchUser[] = [];
        return new Promise<any>((resolve, reject) => {
            this.conversationService.usersChatList(
                this.salonId,
                searchString,
                (status, data) => {
                    if (status === 1) {
                        const response = data as SearchUsersListResponse;
                        let testList = response.data;
                        testList.map((item) => {
                            if (item.user_role === 'C') {
                                tempList.push(item);
                            }
                        });
                        this.isSearchListEmpty = tempList.length === 0 ? true : false
                        return resolve(tempList);
                    } else {
                        this.isSearchListEmpty = true;
                        return resolve([]);
                    }
                }
            );
        });
    }

    checkQuickbloxIdExistOrNot(clientQuickBloxId) {
        if (this.chats.length > 0) {
            const result = this.chats.filter(chat => {
                if (chat.occupants_ids.includes(clientQuickBloxId)) {
                    return chat;
                }
            })
            return result;
        }
    }

    globalUserSelect(clientQuickBloxId, clientId) {
        console.log({ clientQuickBloxId });
        console.log({ clientId });

        let response = this.checkQuickbloxIdExistOrNot(clientQuickBloxId);
        if (response && response.length > 0) {
            this.openChat(response[0]);
        } else {
            this.openCreateDialog(clientQuickBloxId, clientId);
        }
    }

    userSelect(selectedUser) {
        const clientId = selectedUser.value.id,
            clientQuickBloxId = selectedUser.value.quickblox_id

        let response = this.checkQuickbloxIdExistOrNot(clientQuickBloxId);
        if (response && response.length > 0) {
            this.openChat(response[0]);
        } else {
            this.openCreateDialog(clientQuickBloxId, clientId);
        }
    }

    openCreateDialog(clientQuickBloxId, clientId) {
        console.log("clientId", clientId);
        console.log("clientQuickBloxId", clientQuickBloxId);

        let dialogref = this.matDialog.open(ChatCreateDialogComponent, {
            autoFocus: false,
            restoreFocus: false,
            hasBackdrop: true,
            disableClose: true,
            width: '350px',
            data: {
                clientQuickBloxId: clientQuickBloxId,
                clientId: clientId,
                salonId: this.salonId
            }
        });
        dialogref.afterClosed().subscribe((response) => {
            if (response === 'success') {
                this.isCratedNewDialog = true;
                this.getChatList();
            }
        });
    }

    openChat(chat) {
        this.selectedChat = chat._id;
        this.dialogService.currentDialog = chat;
        this.messageService.selectedConversationEvent.emit(chat);
    }
}
