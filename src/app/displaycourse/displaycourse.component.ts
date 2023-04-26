import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { QuizService } from './../services/quiz.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-displaycourse',
  templateUrl: './displaycourse.component.html',
  styleUrls: ['./displaycourse.component.scss']
})
export class DisplaycourseComponent implements OnInit {
courseid;
  titleObs;
  title: string;
  courses=[];
  quiz_questions=[];
  isVideo=false;
  constructor( private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private auth: AuthService) { 
      if (!auth.Authenticate()) {
        this.router.navigate(['/']);
        //demo
      }
  
      this.courseid = this.route.snapshot.params.quizid;
      this.quizService.getQuizTitle(this.courseid).subscribe((res) => {
        this.titleObs = <Object>res.payload.data();
        this.title = this.titleObs.title;
      });
    }

    

  ngOnInit(): void {
    this.quizService.getQuizQuestion(this.courseid).then(async (res) => {
      res.forEach(element=>{
        this.quiz_questions.push(element.data())
      });

       for await (const quiz_id of this.quiz_questions) { 
        //console.log(quiz_id);
        this.quizService.getQuestionDetails(quiz_id.question_id).then(async (question)=>{
          //console.log(question.data());
          this.courses.push(question.data());
        });
    }


    
  });
  
 
 

  }

}
