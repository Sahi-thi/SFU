import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DashBoardGuardService implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService) { }

    async canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        if (await this.authService.isUserAuthenticated()) {
            const currentUser = localStorage.getItem('userRole');
            if (
                route.data.role &&
                route.data.role !== currentUser
            ) {
                this.router.navigate(['']);
                return true;
            }
            return true;
        } else {
            this.router.navigate(['']);
            return false;
        }

    }

}
