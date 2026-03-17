import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFilter } from './character-filter';

describe('CharacterFilter', () => {
  let component: CharacterFilter;
  let fixture: ComponentFixture<CharacterFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
