import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { QuizService } from './../services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-displayquiz',
  templateUrl: './displayquiz.component.html',
  styleUrls: ['./displayquiz.component.css'],
})
export class DisplayquizComponent implements OnInit {
  quiz_questions=[];
  questions = [];
  correctAnswer = [];
  quizid: string;
  
  isVideo=false;
  selectedAnswer = [];
  myDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  dateString: string;
  titleObs;
  title: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private auth: AuthService
  ) {
    if (!auth.Authenticate()) {
      this.router.navigate(['/']);
      //demo
    }

    this.quizid = this.route.snapshot.params.quizid;
    this.quizService.getQuizTitle(this.quizid).subscribe((res) => {
      this.titleObs = <Object>res.payload.data();
      this.title = this.titleObs.title;
    });
  }

  ngOnInit(): void {
    this.quizService.getQuizQuestion(this.quizid).then(async (res) => {
      res.forEach(element=>{
        this.quiz_questions.push(element.data())
      });

       for await (const quiz_id of this.quiz_questions) { 
        //console.log(quiz_id);
        this.quizService.getQuestionDetails(quiz_id.question_id).then(async (question)=>{
          //console.log(question.data());
          this.questions.push(question.data());

        })
       
    }
  });
  



}
  score = 0;
  radioChangeHandler(event: any, index: number, ans: string) {
    this.selectedAnswer[index] = event.target.value;
    this.correctAnswer[index] = ans;
  }
  result: string;
  onSubmit() {
    for (var i = 0; i < this.selectedAnswer.length; i++) {
      if (this.selectedAnswer[i] === this.correctAnswer[i]) {
        this.score = this.score + 1;
      }
    }
    this.result = this.score + '/' + this.quiz_questions.length;
    Swal.fire('Test Completed', 'Your Score is '+this.result, 'success').then((res) => {
      this.quizService.storeScores(this.myDate, this.result, this.quizid);
      this.router.navigate(['user']);
    });
  }
}
