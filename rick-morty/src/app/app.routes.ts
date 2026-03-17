import {Routes} from '@angular/router';
import {MainLayout} from './shared/main-layout/main-layout';
import {APP_ROUTES} from './shared/models';
import {authGuard} from './core/guards/auth-guard/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
      }
    ]
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: `${APP_ROUTES.CHARACTERS}`, pathMatch: 'full' },
      {
        path: `${APP_ROUTES.CHARACTERS}`,
        loadComponent: () => import('./features/characters/characters').then(m => m.Characters)
      },
      {
        path: `${APP_ROUTES.CHARACTER_DETAILS}/:id`,
        loadComponent: () => import('./features/character-details/character-details').then(m => m.CharacterDetails)
      },
      {
        path: APP_ROUTES.LOCATIONS,
        loadComponent: () => import('./features/locations/locations').then(m => m.Locations)
      },
      {
        path: `${APP_ROUTES.LOCATIONS_DETAILS}/:id`,
        loadComponent: () => import('./features/location-details/location-details').then(m => m.LocationDetails)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
  },
  { path: '**', redirectTo: '404' }

];
