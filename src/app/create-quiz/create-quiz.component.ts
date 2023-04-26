import  Swal  from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import {CreateQuizService} from './../services/create-quiz.service';
import { FormBuilder, FormGroup, FormArray, FormControl,Validators } from '@angular/forms';
//import { CorrectAnswerValidator } from './../validators';
@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {
  urlPattern=/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/;
  addValue=0;
  videoForm:FormGroup;
  CorrectAnswerValidator(group: FormGroup) {
    
    const correctAns = group.controls.correct_ans.value;
    const option1 = group.controls.option_1.value;
    const option2 = group.controls.option_2.value;
    const option3 = group.controls.option_3.value;
    const option4 = group.controls.option_4.value;
    let options = [option1,option2,option3,option4];
    
  
    return options.includes(correctAns) ? null : { correctAnswerNotThere: true }     
  }

  addQuestion(){
    if(this.addValue==0)
    {
      this.addValue=1;
    }
    else
    {
      Swal.fire({
        title: 'Are you sure you want to make these changes to the quiz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I want to change my option!'
        }).then(async(result) => {
        if (result.value) {
      window.location.reload();
        }
      });
    }
    
  }
  addVideo(){
    if(this.addValue==0)
    {
      this.addValue=2;
    }
    else
    {
      Swal.fire({
        title: 'Are you sure you want to make these changes to the quiz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I want to change my option!'
        }).then(async(result) => {
        if (result.value) {
      window.location.reload();
        }
      });
    }
  }
  addText(){
    if(this.addValue==0)
    {
      this.addValue=3;
    }
    else
    {
      Swal.fire({
        title: 'Are you sure you want to make these changes to the quiz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I want to change my option!'
        }).then(async(result) => {
        if (result.value) {
      window.location.reload();
        }
      });
    }
  }
  
  async onSubmitText(quizname,quizdescription,quizTextContent){
    console.log(quizTextContent);
    if(quizname=="" || quizdescription==""||quizTextContent=="")
    {
      Swal.fire(
        'You forgot course details?',
        'Please check!',
        'question'
        );
      return;
    }
    // let Quiz={
    //   'title': quizname,
    //   'description':quizdescription,
    //   'Quiz Context':quizTextContent
    // };
    //console.log(Quiz);
    await this.createQuiz.addQuizText(quizname,quizdescription,quizTextContent);
    this.route.navigate(['/user']);

  }

 async  onSubmitVideo(quizname,quizdescription,quizVideoContent){
    console.log(quizVideoContent);
    if(quizname=="" || quizdescription=="")
    {
      Swal.fire(
        'You forgot course details?',
        'Please check!',
        'question'
        );
      return;
    }
    await this.createQuiz.addQuizVideo(quizname,quizdescription,quizVideoContent);
    this.route.navigate(['/user']);
  }
  // onSubmitQuestions(quizname,quizdescription,questions){
    
  //   let Quiz={
  //     'Quiz Name': quizname,
  //     'Quiz Description':quizdescription,
  //     'Quiz Questions': questions
  //   };
  //   console.log(Quiz);
  //   this.createQuiz.addQuiz(Quiz);
  // }
  
  
  constructor(public auth:AuthService,private route:Router, private createQuiz:CreateQuizService,private fb: FormBuilder) { 
    if (!auth.Authenticate()) {
      this.route.navigate(['/']);
    }
    else{
      if (!auth.isAdmin()){
        this.route.navigate(['user']);
      }
    }
  }
  ngOnInit(): void {
    console.log(this.addValue);
    this.productForm = this.fb.group({
      questions1: this.fb.array([this.fb.group({
      question:['',Validators.required],
      option_1:['',Validators.required],
      option_2:['',Validators.required],
      option_3:['',Validators.required],
      option_4:['',Validators.required],
      correct_ans:['',Validators.required]
      }, {validator: this.CorrectAnswerValidator })])
    });

    this.videoForm = this.fb.group({
    quizVideoContent:['',[Validators.required,Validators.pattern(this.urlPattern)]]
    });

   

  }
  get getQuestions() {
    return this.productForm.get('questions1') as FormArray;
  }
  addSellingPoint() {
    this.getQuestions.push(this.fb.group({
      question:['',Validators.required],
      option_1:['',Validators.required],
      option_2:['',Validators.required],
      option_3:['',Validators.required],
      option_4:['',Validators.required],
      correct_ans:['',Validators.required]
  
  },{validator: this.CorrectAnswerValidator }));
  }

  productForm: FormGroup;
  public questions:any[]  = [{
    //id: 1,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4:'',
    correct:''
  }];
  
  

  logValue1() {
    console.log(this.productForm.value.questions1);
  }
  addAddress() {
    this.questions.push({
     //id: this.questions.length + 1,
      question: '',
    option1: '',
    option2: '',
    option3: '',
    option4:'',
    correct:''
      
    });
  }

  removeAddress(i: number) {
    this.questions.splice(i, 1);
  }

  logValue(quizname,quizdescription) {
    console.log(name)
    if(this.productForm.valid && !(quizname=="") && !(quizdescription==""))
    {
    console.log(this.questions,quizname,quizdescription);
    this.createQuiz.quizQuestions(quizname,quizdescription,this.productForm.value.questions1);
    this.route.navigate(['/user']);
    }
    else
    {
      //console.log(this.productForm.valid);
      Swal.fire(
        'Your form is Incomplete',
        ' please fill all details required',
        'question'
        );
    }

  }
}



