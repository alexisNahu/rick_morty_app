import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../../../core/services/auth/auth-service';
import {APP_ROUTES} from '../../../shared/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss', // Reutiliza o adapta el estilo de login
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  message = signal<string | null>(null);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    repeat_password: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });

  // Validador personalizado para comparar contraseñas
// Cambiá el validator para que también marque el control repeat_password
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password');
    const repeat = g.get('repeat_password');

    if (password?.value !== repeat?.value) {
      repeat?.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    // ✅ Limpiar el error si coinciden
    repeat?.setErrors(null);
    return null;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.message.set('Por favor, revisa los campos y asegúrate de que las contraseñas coincidan.');
      return;
    }

    this.isLoading.set(true);
    this.message.set(null);

    const formValue = this.registerForm.value

    const res = await this.authService.register(formValue)

    this.message.set(res.msg)

    if (res.status === 200) this.router.navigate([APP_ROUTES.LOGIN]);

    this.isLoading.set(false);
  }
}
