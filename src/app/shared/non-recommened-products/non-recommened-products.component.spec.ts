import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonRecommenedProductsComponent } from './non-recommened-products.component';

describe('NonRecommenedProductsComponent', () => {
  let component: NonRecommenedProductsComponent;
  let fixture: ComponentFixture<NonRecommenedProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonRecommenedProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonRecommenedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
