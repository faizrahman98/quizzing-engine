import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class CreateQuizService {

  constructor(private firestore: AngularFirestore, private _fb: FormBuilder) { }





  async addQuizText(quizname,quizdescription,quiz_txt) {
    let quiz={
      title:quizname,
      description:quizdescription,
      isCourse:true
    }
    let quiz_id=  (await this.firestore.collection('quiz').add(quiz)).id;
    console.log(quiz_id);
    let ques_text={
      question_text:quiz_txt,
      is_doc:true,
      is_video:false
    }
    let new_ques=  (await this.firestore.collection('questions').add(ques_text)).id;
    console.log(new_ques);
    let mapping={
      quiz_id:quiz_id,
      question_id:new_ques
    };

    let map_id=  (await this.firestore.collection('quiz_questions').add(mapping)).id;
    console.log(map_id);
    alert('Added to db')



  }

  async addQuizVideo(quizname,quizdescription,quiz_txt) {
    let quiz={
      title:quizname,
      description:quizdescription,
      isCourse:true,
      
    }
    let quiz_id=  (await this.firestore.collection('quiz').add(quiz)).id;
    console.log(quiz_id);
    let ques_text={
      question_video:quiz_txt,
      is_doc:true,
      is_video:true
    }
    let new_ques=  (await this.firestore.collection('questions').add(ques_text)).id;
    console.log(new_ques);
    let mapping={
      quiz_id:quiz_id,
      question_id:new_ques
    };

    let map_id=  (await this.firestore.collection('quiz_questions').add(mapping)).id;
    console.log(map_id);
    alert('Added to db')



  }



  async quizQuestions(quizname, quizdescription, questions) {
    let current_ques_ids = [];

    await questions.map((question) => {
      console.log(question);
      let ques_id = this.firestore.collection('questions').add(question);
      ques_id.then(function (qid) {
        console.log(qid.id);
        current_ques_ids.push(qid.id);
      })
    });
    console.log(current_ques_ids);
    alert('Added All Quiestions to the Database Please Check it...');
    let current_quiz_id;
    let Quiz = {
      'title': quizname,
      'description': quizdescription,
      'isCourse':false
    };
    await this.firestore.collection('quiz').add(Quiz).then(function (current_quiz) {
      current_quiz_id = current_quiz.id;
    });

    let mapping = [];
    await current_ques_ids.map(function (current_question_id) {
      mapping.push({
        question_id: current_question_id,
        quiz_id: current_quiz_id
      })
      console.log(current_question_id);


    });

    mapping.map((eachmap) => {
      this.firestore.collection('quiz_questions').add(eachmap);
    })


    alert('Added Quiz title and description in the Data base Chek karlena..');


  }

  async updateQuiz(quizId, newQuestions) {
    let current_ques_ids = [];
    let mapping =[];
    for(let i =0; i<newQuestions.length; i++)
    {
     let temp = await (await this.firestore.collection('questions').add(newQuestions[i])).id;
     console.log(temp);
     current_ques_ids.push(temp);
    }

    for(let i =0; i < current_ques_ids.length; i++)
    {
      mapping.push({
                question_id: current_ques_ids[i],
                quiz_id: quizId
              });
    }
    for(let i=0;i<mapping.length;i++)
    {
       await this.firestore.collection('quiz_questions').add(mapping[i]);
    }
    
    
    

    // await newQuestions.map((question) => {
    //   console.log(question);
    //   let ques_id = this.firestore.collection('questions').add(question);
    //   ques_id.then(function (qid) {
    //     console.log(qid.id);
    //     current_ques_ids.push(qid.id);
    //   }).then(async () => {
    //     console.log(current_ques_ids);
    //     let mapping = [];
    //     for await (const current_question_id of current_ques_ids) {
    //       console.log('Adding questions...');
    //       mapping.push({
    //         question_id: current_question_id,
    //         quiz_id: quizId
    //       })
    //     }
    //     console.log(mapping);
    //     for (let eachmap of mapping) {
    //       console.log("haha")
    //       this.firestore.collection('quiz_questions').add(eachmap);
    //     }
        //   await current_ques_ids.map(function(current_question_id){
        //   mapping.push({
        //     question_id:current_question_id,
        //     quiz_id:quizId
        //   })
        //   console.log(current_question_id);


        // });


        //console.log(mapping);
    //   })
    // });
    console.log(current_ques_ids);
    alert('Added All Quiestions to the Database Please Check it...');

    alert('Added Quiz title and description in the Data base Chek karlena..');
  }

  deleteQuestion(question, quizId) {
    var promise;
    //console.log(question.question);
    this.firestore
      .collection('questions', (ref) => ref.where('question', '==', question.question).where('correct_ans', '==', question.correct_ans)).get().subscribe(res => {
        res.forEach(ele => {
          //console.log(ele.id);
          this.firestore
            .collection('quiz_questions', (ref) => ref.where('question_id', '==', ele.id).where('quiz_id', '==', quizId)).get().subscribe(res2 => {
              console.log(res2);
              let temp=[];
              res2.forEach((element)=>{
                temp.push(element.id);
              })
              // res2.forEach(ele2 => {
              //   console.log(ele2.id);

              //   promise = new Promise((resolve, reject) => {
              //     this.firestore.collection('quiz_questions').doc(ele2.id).delete().then(() => {
              //       resolve();
              //     })

              //   });


              // })
              for(let i=0;i<temp.length;i++)
              {
               console.log(temp[i]);
               return this.firestore.collection('quiz_questions').doc(temp[i]).delete();
              }
            })
        })
      });

   
  }



}

