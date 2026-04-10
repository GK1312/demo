import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanningPage } from './scanning-page';

describe('ScanningPage', () => {
  let component: ScanningPage;
  let fixture: ComponentFixture<ScanningPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanningPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanningPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
