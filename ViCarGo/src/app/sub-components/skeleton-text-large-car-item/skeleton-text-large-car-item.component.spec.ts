import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SkeletonTextLargeCarItemComponent } from './skeleton-text-large-car-item.component';

describe('SkeletonTextLargeCarItemComponent', () => {
  let component: SkeletonTextLargeCarItemComponent;
  let fixture: ComponentFixture<SkeletonTextLargeCarItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SkeletonTextLargeCarItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonTextLargeCarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
