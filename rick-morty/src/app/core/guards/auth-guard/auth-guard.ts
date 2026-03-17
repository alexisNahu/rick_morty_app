// auth-guard.ts
import {CanActivateFn, Router} from '@angular/router';
import {effect, inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {AuthService} from '../../services/auth/auth-service';
import {APP_ROUTES} from '../../../shared/models';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }
  const isIdleOrLoading = () =>
    authService.loggedUser.isLoading() || authService.loggedUser.status() === 'idle';

  if (isIdleOrLoading()) {
    await new Promise((resolve) => {
      const sub = effect(() => {
        if (!isIdleOrLoading()) {
          resolve(true);
          sub.destroy();
        }
      });
    });
  }


  if (authService.loggedUser.error()) {
    return router.createUrlTree([APP_ROUTES.LOGIN]);
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([APP_ROUTES.LOGIN]);
};
