import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleHistoryComponent } from './single-history.component';

describe('SingleHistoryComponent', () => {
  let component: SingleHistoryComponent;
  let fixture: ComponentFixture<SingleHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
