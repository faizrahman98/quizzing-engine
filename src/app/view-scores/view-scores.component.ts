import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-view-scores',
  templateUrl: './view-scores.component.html',
  styleUrls: ['./view-scores.component.scss'],
})
export class ViewScoresComponent implements OnInit {
  results = [];
  constructor(
    public auth: AuthService,
    private route: Router,
    private quizService: QuizService,
    private firestore: AngularFirestore
  ) {
    if (!auth.Authenticate()) {
      this.route.navigate(['/']);
    }
  }
  title;
  ngOnInit(): void {
    this.quizService.getScores().subscribe((res) => {
      res.forEach((element) => {
        //console.log(element.payload.doc.data());
        let data = element.payload.doc.data();
        console.log(data);
        //let title = this.quizService.getQuizTitle(data.quizId)
        this.results.push(element.payload.doc.data());
      });

      this.results.forEach((element) => {
        this.quizService.getQuizTitle(element.quizId).subscribe((res) => {
          console.log(res.payload.data());
          this.title = <Object>res.payload.data();
          element['title'] = this.title.title;
        });
        
      });
      console.log(this.results);
    });
  }
  public returnToAllQuizes() {
    this.route.navigate(['/user']);
  }
}
