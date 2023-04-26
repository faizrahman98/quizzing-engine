import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { ViewScoresComponent } from './view-scores/view-scores.component';
import { DisplayquizComponent } from './displayquiz/displayquiz.component';
import { QuizComponent } from './quiz/quiz.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';
import { DisplaycourseComponent } from './displaycourse/displaycourse.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, ViewScoresComponent, DisplayquizComponent, QuizComponent, CreateQuizComponent, NavbarComponent,EditQuizComponent, DisplaycourseComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
