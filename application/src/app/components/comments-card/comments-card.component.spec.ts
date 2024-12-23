import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsCardComponent } from './comments-card.component';

describe('CommentsCardComponent', () => {
  let component: CommentsCardComponent;
  let fixture: ComponentFixture<CommentsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
