import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes'; // import your routes

// Use provideRouter to provide routing functionality and provideHttpClient for HTTP services
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),   // use the appRoutes here
    provideHttpClient()         // to provide HTTP services like HttpClient
  ]
})
  .catch((err) => console.error(err));
