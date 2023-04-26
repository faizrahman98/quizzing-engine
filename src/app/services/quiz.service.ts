import { element } from 'protractor';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private firestore: AngularFirestore) {}


  getCourse(){
    return this.firestore.collection('quiz',ref=> ref.where('isCourse','==',true)).snapshotChanges();
  }
 
  async getCourseContent(id: string){
    let response = await this.firestore.collection('quiz_questions', (ref) => ref.where('quiz_id', '==', id))
    .get()
    .toPromise();
  return response;
  }

  getQuiz() {
    return this.firestore.collection('quiz').snapshotChanges();
  }

   async getQuizQuestion(id: string) {
    // console.log(id);
    // this.firestore.collection('quiz_questions').valueChanges().subscribe(res=>{
    //   console.log(res);
    // })
    let response = await this.firestore.collection('quiz_questions', (ref) => ref.where('quiz_id', '==', id))
      .get()
      .toPromise();
    return response;
    // return this.firestore
    //   .collection('quiz_questions', (ref) => ref.where('quiz_id', '==', id))
    //   .get().toPromise();
  }
   async getQuestionDetails(questionId:string){
     
    let response=await this.firestore.collection('questions').doc(questionId).get().toPromise();
    return response;
  }
  async getQuestionEdit(questionId:string){
     let questions=[];
       this.firestore.collection('questions').doc(questionId).snapshotChanges().subscribe(result=>{
        console.log(result.payload.data());
        questions.push(result.payload.data());
    });
    console.log(questions);
    
  }
  // getQuizQuestions(id) { 
    
   
  //   return this.firestore.collection('quiz').get(question).then(function(ques){

  //   });
  storeScores(date, result, quizId) {
    let user = JSON.parse(localStorage.getItem('key'));
    let userId = user.userId;
    let userScore = {
      date: date,
      userId: userId,
      quizId: quizId,
      score: result,
    };
    this.firestore.collection('user_scores').add(userScore);
  }
  getScores() {
    let user = JSON.parse(localStorage.getItem('key'));
    let userId = user.userId;
    console.log(userId);
    return this.firestore
      .collection('user_scores', (ref) => ref.where('userId', '==', userId))
      .snapshotChanges();
  }
  getQuizTitle(quizId) {
    return this.firestore.collection('quiz').doc(quizId).snapshotChanges();
  }

  async deleteQuiz(quizid){
    //mp9bn5JgEzr4OWjCXjBb
    let quiz_questionsIds=[];
    await this.firestore.collection('quiz_questions', (ref) => ref.where('quiz_id', '==', quizid)).get().subscribe(async (res)=>{
      await res.forEach(async(element)=>
      {
        console.log(element.id);
        await this.firestore.collection('quiz_questions').doc(element.id).delete();
        console.log('Deleted document ',element.id);

      })
      //console.log(res);
    });
    this.firestore.collection('user_scores', (ref) => ref.where('quiz_id', '==', quizid)).get().subscribe(async(res)=>
    {console.log(85);
      await res.forEach(async(element)=>
      { 

        console.log(element);
        await this.firestore.collection('user_scores').doc(element.id).delete();
        console.log('Deleted Scores document ',element.id);

      })
      //console.log(res);
    })


    return this.firestore.collection('quiz').doc(quizid).delete();
  }



}
