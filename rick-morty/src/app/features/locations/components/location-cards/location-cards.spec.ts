import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCards } from './location-cards';

describe('LocationCards', () => {
  let component: LocationCards;
  let fixture: ComponentFixture<LocationCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
