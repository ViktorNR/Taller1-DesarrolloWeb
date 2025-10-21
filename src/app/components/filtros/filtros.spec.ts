import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { FiltrosComponent } from './filtros';

describe('FiltrosComponent', () => {
  let component: FiltrosComponent;
  let fixture: ComponentFixture<FiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
