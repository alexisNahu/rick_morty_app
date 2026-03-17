import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../../../shared/models';

@Component({
  selector: 'app-location-filter',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './location-filter.html',
  styleUrl: './location-filter.scss',
})
export class LocationFilter {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isFiltersOpen = signal(false)

  // Formulario alineado con el LocationFilterSchema
  searchForm = this.fb.group({
    name: this.fb.control('', { nonNullable: true }),
    type: this.fb.control('', { nonNullable: true }),
    dimension: this.fb.control('', { nonNullable: true }),
  });

  onSubmit() {
    if (this.searchForm.valid) {
      const rawValues = this.searchForm.getRawValue();

      // Filtramos strings vacíos para mantener la URL limpia
      const queryParams = Object.fromEntries(
        Object.entries(rawValues).filter(([_, value]) => value.trim() !== '')
      );

      this.router.navigate(['/', APP_ROUTES.LOCATIONS], {
        queryParams: { ...queryParams, page: 1 },
      });
    }
  }

  onReset() {
    this.searchForm.reset();
    this.router.navigate(['/', APP_ROUTES.LOCATIONS], {
      queryParams: { page: 1 }
    });
  }
}
