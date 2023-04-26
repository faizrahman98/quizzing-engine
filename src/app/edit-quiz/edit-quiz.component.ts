import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {formatDate} from '@angular/common';
import { QuizService } from './../services/quiz.service';
import { FormBuilder, FormGroup, FormArray, FormControl,Validators } from '@angular/forms';
import { async } from 'rxjs/internal/scheduler/async';
import { CreateQuizService } from '../services/create-quiz.service';
import  Swal  from 'sweetalert2';
//import { CorrectAnswerValidator } from './../validators';
@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss']
})
export class EditQuizComponent implements OnInit {
  quizid: string;
  quiz_questions=[];
  questions:Array<any>=[];
  controls: FormArray;
  productForm: FormGroup;
  canDelete = [];

  CorrectAnswerValidator(group: FormGroup) {
    
    const correctAns = group.controls.correct_ans.value;
    const option1 = group.controls.option_1.value;
    const option2 = group.controls.option_2.value;
    const option3 = group.controls.option_3.value;
    const option4 = group.controls.option_4.value;
    let options = [option1,option2,option3,option4];
    
  
    return options.includes(correctAns) ? null : { correctAnswerNotThere: true }     
  }
  

  constructor(private route:ActivatedRoute,private router:Router,private quizService:QuizService,private auth:AuthService,private fb: FormBuilder,private quizedit: CreateQuizService)
   {
     
    this.quizid=this.route.snapshot.params.quizid;
    //console.log(this.quizid);

    
    //let fa = this.formBuilder.array([ this.formBuilder.group({a: 0, b:0}), this.formBuilder.group({a: 0, b:0}) ]) fa.setValue(data)
   }

   async ngOnInit() {
    this.productForm = this.fb.group({
      questions1: this.fb.array([this.fb.group({
      question:['',Validators.required],
      option_1:['',Validators.required],
      option_2:['',Validators.required],
      option_3:['',Validators.required],
      option_4:['',Validators.required],
      correct_ans:['',Validators.required]
      },{validator: this.CorrectAnswerValidator })])
    });
  
this.fetchData();
    }

  fetchData()
  {
    this.quizService.getQuizQuestion(this.quizid).then(async (res) => {
      //console.log(res);
      res.forEach(element=>{
        this.quiz_questions.push(element.data())
      });
      

      for await (const quiz_id of this.quiz_questions) { 
        console.log(quiz_id);
        this.quizService.getQuestionDetails(quiz_id.question_id).then(async (question)=>{
          //console.log(question.data());
          this.questions.push(question.data());
          this.canDelete.push(true);
        });
       }
    });
    console.log(this.questions);
    console.log(this.canDelete);
  }
  //afterDeleteQuestions=[];
  // fetch1Data()
  // {
  //   this.quizService.getQuizQuestion(this.quizid).then(async (res) => {
  //     console.log(res);
  //     res.forEach(element=>{
  //       this.quiz_questions.push(element.data())
  //     });
      

  //     for await (const quiz_id of this.quiz_questions) { 
  //       console.log(quiz_id);
  //       this.quizService.getQuestionDetails(quiz_id.question_id).then(async (question)=>{
  //         console.log(question.data());
  //         this.afterDeleteQuestions.push(question.data());
  //       });
  //      }
  //   });
  //   console.log(this.afterDeleteQuestions);
  //   for(let i=0;i<this.afterDeleteQuestions.length;i++)
  //   {
  //     this.questions[i]=this.afterDeleteQuestions[i];
  //   }
  //   console.log(this.afterDeleteQuestions);
  // }
  get getQuestions() {
    return this.productForm.get('questions1') as FormArray;
  }
  async buildForm() {
   
    let allquestions:Array<any>=[];
    for await(const ques of this.questions){
      allquestions.push(ques);
    }
   
    let toGroups = allquestions.map( entity => {
      //console.log(entity);
      let temp = new FormGroup({
        question: new FormControl(entity.question, Validators.required),
        option_1: new FormControl(entity.option_1, Validators.required),
        option_2: new FormControl(entity.option_2, Validators.required),
        option_3: new FormControl(entity.option_3, Validators.required),
        option_4: new FormControl(entity.option_4, Validators.required),
        correct_ans: new FormControl(entity.correct_ans, Validators.required)
       
      });
      temp.setValidators(this.CorrectAnswerValidator);
      return temp;
    });
    this.controls = new FormArray(toGroups);
    console.log(this.controls.value);
  }

  getControl(index: number, field: string) : FormControl {
    return this.controls.at(index).get(field) as FormControl;
  }

  addSellingPoint() {
    this.getQuestions.push(this.fb.group({
      question:['',[Validators.required]],
      option_1:['',[Validators.required]],
      option_2:['',[Validators.required]],
      option_3:['',[Validators.required]],
      option_4:['',[Validators.required]],
      correct_ans:['',[Validators.required]]
  
  }, {validator: this.CorrectAnswerValidator }));
  }

  logValue1() {
    if(this.productForm.valid){
    Swal.fire({
      title: 'Are you sure you want to make these changes to the quiz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit my changes!'
      }).then(async(result) => {
      if (result.value) {
    console.log(this.productForm.value.questions1);
    this.quizedit.updateQuiz(this.quizid,this.productForm.value.questions1);
    this.router.navigate(['/user']);
      }
    });
  }
  else
  {
    Swal.fire(
      'Your form',
      'is not valid',
      'question'
      );
  }
  }
  async deleteQuiz(){
    Swal.fire({
      title: 'Are you sure you want to delete the quiz?',
      text: "You won't be able to revert this",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,delete it!'
      }).then(async(result) => {
        if(result.value){
   let temp = await this.quizService.deleteQuiz(this.quizid);
   this.router.navigate(['/user']);}
      });
  }
  async deleteQuestion(questionID){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
      }).then(async(result) => {
      if (result.value) {
        for await(let question of this.questions){
          
          if(questionID==this.questions.indexOf(question)){
            console.log(question);
             await this.quizedit.deleteQuestion(question,this.quizid)
             
            }
        }
        this.canDelete[questionID]=false;
      }
      })
    
    //this.questions.splice(0,this.questions.length);
    
           //this.fetch1Data();
  }
  
    
   
  


  }
   

  
  
  
  

  
  

