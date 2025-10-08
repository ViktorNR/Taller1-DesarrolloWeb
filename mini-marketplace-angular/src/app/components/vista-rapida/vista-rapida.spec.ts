import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaRapida } from './vista-rapida';

describe('VistaRapida', () => {
  let component: VistaRapida;
  let fixture: ComponentFixture<VistaRapida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaRapida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaRapida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
