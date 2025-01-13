import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardComponent } from './form-card.component';

xdescribe('FormCardComponent', () => {
  let component: FormCardComponent;
  let fixture: ComponentFixture<FormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
