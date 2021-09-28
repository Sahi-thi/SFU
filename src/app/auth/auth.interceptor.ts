import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    environmentUrl: string;

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem('access_token');

        if (token != null) {

            let copiedRequest = req.clone({
                headers:
                    req.headers.set('Authorization', token)
                        .set('Content-Type', 'application/json')
            });

            return next.handle(copiedRequest);
        }
        return next.handle(req);
    }

}
