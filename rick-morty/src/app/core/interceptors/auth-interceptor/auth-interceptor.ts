import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from '../../services/auth/auth-service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {APP_ROUTES} from '../../../shared/models';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isPublicApi = req.url.includes('rickandmortyapi.com')
  const router = inject(Router);

  if (isPublicApi) return next(req);

  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
          router.navigate([APP_ROUTES.LOGIN]);
      }
      return throwError(() => error);
    })
  );
};
