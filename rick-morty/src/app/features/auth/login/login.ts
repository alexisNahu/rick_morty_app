import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth/auth-service';
import {Router, RouterLink} from '@angular/router';
import {APP_ROUTES} from '../../../shared/models';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  message = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.message.set(null);

    const { email, password } = this.loginForm.value;

      const res = await this.authService.login({email, password});
      this.message.set(res.msg)


      if (res.status === 200) {
        this.router.navigate([APP_ROUTES.CHARACTERS]);
        this.isLoading.set(false);
      }

  }

  protected readonly APP_ROUTES = APP_ROUTES;
}
