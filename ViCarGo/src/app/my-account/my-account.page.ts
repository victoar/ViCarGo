import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigate(['/'], {replaceUrl: true});
  }

  navigateTo(nextLocation: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        swipeTransition: true // Add custom query param for swipe transition
      },
      fragment: 'anchor' // Add fragment for scrolling to anchor in User Details page (optional)
    };

    this.router.navigate([nextLocation], navigationExtras);
  }

  privacySettings() {
    // Implement logic to navigate to privacy settings page
    console.log('Privacy Settings clicked');
  }
}
