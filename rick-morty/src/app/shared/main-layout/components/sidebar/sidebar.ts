import {Component, effect, inject, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {APP_ROUTES} from '../../../models';
import {filter} from 'rxjs';
import {AuthService} from '../../../../core/services/auth/auth-service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

  private router = inject(Router);
  private authService = inject(AuthService)

  protected readonly APP_ROUTES = APP_ROUTES;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.isSidebarOpen.set(false));
  }

  isSidebarOpen = signal(false)

  toggleSidebar = () => this.isSidebarOpen.set(!this.isSidebarOpen())

  async logout () {
    await this.authService.logout()

    this.router.navigate([APP_ROUTES.LOGIN])
  }
}
