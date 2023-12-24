import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdCategoryComponent } from './prod-category.component';

describe('ProdCategoryComponent', () => {
  let component: ProdCategoryComponent;
  let fixture: ComponentFixture<ProdCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
