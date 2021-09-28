
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class FormsGuardService implements CanActivate {

    constructor(private router: Router) { }

    async canActivate() {
        return this.router.navigate(['forms'])
    }

}
