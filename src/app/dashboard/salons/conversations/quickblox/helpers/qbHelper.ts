import { Injectable } from '@angular/core';

declare var QB: any;
@Injectable()
export class QBHelper {
    constructor() { }

    public getSession() {
        return QB && QB.service ? QB.service.getSession() : null;
    }

    public qbLogout() {
        localStorage.removeItem('loggedinUser');
        localStorage.removeItem('sessionResponse');
        QB.chat.disconnect();
        QB.destroySession(() => null);
    }

    public createUserSession(user): Promise<any> {
        return new Promise((resolve, reject) => {
            let params = {
                login: user.email,
                password: user.password,
            };
            QB.createSession(params, function(sessionErr, sessionRes) {
                if (sessionErr) {
                    reject(sessionErr);
                } else {
                    resolve(sessionRes);
                }
            });
        });
    }
    public qbCreateConnection(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createUserSession(user)
                .then((sessionResponse) => {
                    localStorage.setItem('sessionResponse', sessionResponse);
                    const params = {
                        login: user.login,
                        password: user.password,
                    };
                    QB.login(params, function(loginErr, loginRes) {
                        if (loginErr) {
                            reject(loginErr);
                        } else {
                            resolve(loginRes);
                        }
                    });
                })
                .catch((error) => {
                    error.status = 401;
                    reject(error);
                });
        });
    }

    public createSessionAndConnect() {
        let user = {
            email: localStorage.getItem('email'),
            password: '{!Sfu2020}',
        };
        return new Promise((resolve, reject) => {
            this.createUserSession(user)
                .then((sessionResponse) => {
                    localStorage.setItem('sessionResponse', sessionResponse);

                    QB.login(user, function(loginErr, loginRes) {
                        if (loginErr) {
                            reject(loginErr);
                        } else {
                            const params = {
                                userId: JSON.parse(localStorage.getItem('loggedinUser')).id,
                                password: '{!Sfu2020}',
                            };
                            QB.chat.connect(params, function(chatErr, chatRes) {
                                if (chatErr) {
                                    reject(chatErr);
                                } else {
                                    resolve(chatRes);
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    error.status = 401;
                    reject(error);
                });
        });
    }

    public qbChatConnection(userId: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = {
                userId: userId,
                password: password,
            };
            // console.log("params qbChatConnection", params);

            QB.chat.connect(params, function(chatErr, chatRes) {
                if (chatErr) {
                    // console.log("chatErr QB.chat.connect", chatErr);

                    reject(chatErr);
                } else {
                    // console.log("chatRes QB.chat.connect", chatRes);
                    resolve(chatRes);
                }
            });
        });
    }
}
