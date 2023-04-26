import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../services/auth.service';
import { QuizService } from './../services/quiz.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  quizzes = [];
  only_quiz=[];
  isAdmin:boolean;
  courses=[];
  quizTitle;
  constructor(
    public auth: AuthService,
    private quizService: QuizService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore 
  ) {
    if (!auth.Authenticate()) {
      this.route.navigate(['/']);
    }
    this.isAdmin=auth.isAdmin();
  }

   ngOnInit() {
    this.quizService.getQuiz().subscribe(async (res) => {
      this.quizzes = res;

      console.log(this.quizzes);
     this.only_quiz= await this.quizzes.filter(eachquiz=>{
      return eachquiz.payload.doc.data().isCourse==false;
      })

      console.log(this.only_quiz);
    });

    this.quizService.getCourse().subscribe( (res) => {
       this.courses = res;

      
    });
;


  }
  

myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = this.quizTitle;
  console.log("search"+input)
  filter = input.toUpperCase();
  table = document.getElementById("container1");
  tr = table.getElementsByClassName("quiz");
  console.log(tr);
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByClassName("quizTitle")[0];
    console.log(td);
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}
  //   onItemChange(value){
  //     console.log(" Value is : ", value );
  //  }
}
