import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'eLearning App';

  constructor(private router: Router) { }

  ngOnInit() {
    // Log when routing begins
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started to:', event.url);  // Log route change start
      } else if (event instanceof NavigationEnd) {
        console.log('Navigation ended at:', event.url);  // Log route change end
      }
    });
  }
}