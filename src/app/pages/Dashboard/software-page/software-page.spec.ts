import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwarePage } from './software-page';

describe('SoftwarePage', () => {
  let component: SoftwarePage;
  let fixture: ComponentFixture<SoftwarePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftwarePage],
    }).compileComponents();

    fixture = TestBed.createComponent(SoftwarePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
