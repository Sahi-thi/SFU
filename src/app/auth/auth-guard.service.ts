
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from '../../utils/enums';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    async canActivate() {
        const user = localStorage.getItem('userRole');
        
        const salonId = localStorage.getItem('salon_id');
        if (this.authService.isUserAuthenticated()) {
            user === UserRole.superAdmin ?
                this.router.navigate(['home/salons']) : user === UserRole.admin ?
                    this.router.navigate(['/home/salons/salon/' + salonId + '/details']) : this.router.navigate(["/home/salons/salon/" + salonId + "/clients"])
            return false;
        } else {
            return true;
        }
    }

}
