import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBankingComponent } from './confirm-banking.component';

describe('ConfirmBankingComponent', () => {
  let component: ConfirmBankingComponent;
  let fixture: ComponentFixture<ConfirmBankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmBankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
