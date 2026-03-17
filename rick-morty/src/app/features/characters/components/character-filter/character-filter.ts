import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from '@angular/router';

@Component({
  selector: 'app-character-filter',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './character-filter.html',
  styleUrl: './character-filter.scss',
})
export class CharacterFilter {
  private fb = inject(FormBuilder)
  private router = inject(Router)

  isFiltersOpen = signal(false)

  searchForm = this.fb.group({
    name: this.fb.control('', { nonNullable: true }),
    status: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.pattern(/^(alive|dead|unknown)$/)]
    }),
    species: this.fb.control('', { nonNullable: true }),
    type: this.fb.control('', { nonNullable: true }),
    gender: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.pattern(/^(male|female|genderless|unknown)$/)]})
  })


  onSubmit() {
    if (this.searchForm.valid){
      const rawValues = this.searchForm.getRawValue();

      const queryParams = Object.fromEntries(
        Object.entries(rawValues).filter(([_, value]) => value !== '')
      );

      this.router.navigate([], {
        queryParams: {...queryParams, page: 1}
      })
    }
  }
}
