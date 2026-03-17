import {computed, effect, inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {APIS, BackendResponse, UserPayload} from '../../../shared/models';
import {firstValueFrom} from 'rxjs';
import {LoginSchemaType, RegisterSchemaType} from '../../../shared/schemas/auth.schemas';
import {isPlatformBrowser} from '@angular/common';

type BackendLoginResponse = BackendResponse<{ accessToken: string , refreshToken: string}>

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private readonly auth_router = APIS.BACKEND.AUTH

  private readonly http = inject(HttpClient)

  private readonly platformId = inject(PLATFORM_ID);


  loggedUser = httpResource<UserPayload | undefined>(() => {
    if (!isPlatformBrowser(this.platformId)) return undefined;

    return {
      url: this.auth_router.ME,
      method: 'GET',
      withCredentials: true
    };
  });

  isAuthenticated = computed(() => {
    if (this.loggedUser.error()) return false;
    return !!this.loggedUser.value();
  });

  login = async ({email, password}: LoginSchemaType): Promise<{ msg: string, status: number }> => {
    try {
      await firstValueFrom(this.http.post<BackendLoginResponse>(
        this.auth_router.LOGIN, {email, password},{withCredentials: true}
      ))

      this.loggedUser.reload()

      return {msg: 'User logged succesfully', status: 200}
    } catch (e: any) {
      if (e.status === 401) {
        return {msg: 'Invalid credentials', status: e.status}
      } else {
        return {msg: 'Interval Server Error', status: e.status}
      }
    }
  }

  register = async ({name, email, password, repeat_password}: RegisterSchemaType) => {
    try {
      await firstValueFrom(this.http.post(
        this.auth_router.REGISTER, {email, password, name, repeat_password}, {withCredentials: true}
      ))

      return {msg: 'User registered succesfully', status: 200}
    } catch (e: any) {
      if (e.status === 400) return {msg: 'The data is not set corectly', status: 400}
      if (e.status === 409) {
        return {msg: 'Email already registered', status: 409}
      } else {
        return {msg: 'Interval server error' , status: e.status}
      }
    }
  }

  logout = async () => {
    try {
      await firstValueFrom(this.http.post(  // ✅ firstValueFrom
        this.auth_router.LOGOUT, {}, { withCredentials: true }
      ));


      return {msg: 'Logout succesfull', status: 200}

    } catch (e: any) {
      return { msg: 'Error al cerrar sesión', status: e.status };
    }
  }



}
