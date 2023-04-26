import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScoresComponent } from './view-scores.component';

describe('ViewScoresComponent', () => {
  let component: ViewScoresComponent;
  let fixture: ComponentFixture<ViewScoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewScoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
