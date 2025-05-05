import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent ,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentPageTitle = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setCurrentPageTitle(event.urlAfterRedirects);
      });
  }
  setCurrentPageTitle(url: string) {
    if (url.startsWith('/home')) this.currentPageTitle = 'Home';
    else if (url.startsWith('/search')) this.currentPageTitle = 'Search';
    else if (url.startsWith('/profile')) this.currentPageTitle = 'Profile';
    else if (url.startsWith('/notifications')) this.currentPageTitle = 'Notifications';
    else if (url.startsWith('/auth')) this.currentPageTitle = 'Login';
    else if (url.startsWith('/register')) this.currentPageTitle = 'Register';
    else if (url.startsWith('/posts')) this.currentPageTitle = 'Post';
    else this.currentPageTitle = '';
  }
}
