import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: 'Time Tracker';
  opened: false

  get menuIcon(): string {
    return this.opened ? 'menu_open' : 'menu';
  }
}
