import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { ViewScoresComponent } from './view-scores/view-scores.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DisplayquizComponent } from './displayquiz/displayquiz.component';
import { QuizComponent } from './quiz/quiz.component';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';
import { DisplaycourseComponent } from './displaycourse/displaycourse.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'user', component: QuizComponent },
  { path: 'viewScores', component: ViewScoresComponent },
  { path: 'displayQuiz', component: DisplayquizComponent },
  { path: 'editQuiz/:quizid', component: EditQuizComponent },
  { path: 'displaycourse/:quizid', component:DisplaycourseComponent},
  {path:'displayquiz/:quizid',component:DisplayquizComponent},
  {path:'createQuiz',component:CreateQuizComponent},
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
