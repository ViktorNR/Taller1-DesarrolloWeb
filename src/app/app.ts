import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FiltrosComponent } from './components/filtros/filtros';
import { FooterComponent } from './components/footer/footer';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FiltrosComponent,
    FooterComponent,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Mini Marketplace UNAB');
  
  constructor() {
    console.log('🚀 App Component: Initialized');
  }
}
