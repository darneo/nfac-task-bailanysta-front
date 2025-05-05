import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { HomeComponent } from './features/home/home.component';
import { PostDetailComponent } from './features/post-detail/post-detail.component';
import { RegisterComponent } from './features/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SearchComponent } from './search/search.component';
import { NotificationsComponent } from './features/notifications/notifications.component';

export const routes: Routes = [ 
    {
        path : 'auth' , component : AuthComponent , title : 'Вход'
    }, 
    {
        path : 'register', component : RegisterComponent , title : 'Регистрация'
    },
    {
        path : 'home' , component : HomeComponent , title : 'UConnect'
    }, 
    {
        path : 'posts/:id' , component :PostDetailComponent , title : 'Post page'
    },
    { 
        path: 'profile/:username', component: ProfileComponent, title : 'Profile page'
    },
    {
        path: 'search', component: SearchComponent, title : 'search'
    },
    {
        path: 'notifications', component : NotificationsComponent, title : 'Notifications'
    },
];