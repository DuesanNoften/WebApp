import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { RaceComponent } from './race/race.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyActivitiesComponent } from './my-activities/my-activities.component';
import { GroupsComponent } from './groups/groups.component';
import { FriendsComponent } from './friends/friends.component';
import { SharedService } from './services/SharedService/shared.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MapComponent } from './map/map.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    ChallengeComponent,
    RaceComponent,
    NavbarComponent,
    MyActivitiesComponent,
    GroupsComponent,
    FriendsComponent,
    EditUserComponent,
    MapComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'challenge', component: ChallengeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'race', component: RaceComponent },
      { path: '', component: SignInComponent },
      { path: 'signUp', component: SignUpComponent },
      { path: 'myAct', component: MyActivitiesComponent },
      { path: 'groups', component: GroupsComponent },
      { path: 'friends', component: FriendsComponent },
      { path: 'editUser', component: EditUserComponent },
      { path: 'admin', component: AdminComponent },
    ])
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
