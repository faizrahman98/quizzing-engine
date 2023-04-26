import { Injectable } from '@angular/core';
import { Observable, of, merge } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private route:ActivatedRoute
  ) {}

  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (result.additionalUserInfo.isNewUser) {
          this.newUser(result);
        } else {
          this.oldUser(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  newUser(result) {
    let user = {
      userId: result.user.uid,
      email: result.user.email,
      name: result.user.displayName,
      isLogged: true,
      isAdmin: false,
    };
    this.afs.doc(`users/${user.userId}`).set(user, { merge: true });
    localStorage.clear();
    localStorage.setItem('key', JSON.stringify(user));
    this.router.navigate(['/user']);
  }

  oldUser(result) {
    let UID = result.user.uid;
    console.log(UID);
    let user;
    this.afs
      .collection('users')
      .doc(UID)
      .snapshotChanges()
      .subscribe((data) => {
        console.log(data.payload.data());
        user = data.payload.data();
        console.log(user.isLogged);
        user.isLogged = true;
        localStorage.setItem('key', JSON.stringify(user));
        this.router.navigate(['/user']);
      });
  }

  signOut() {
    this.afAuth.signOut();
    let user = JSON.parse(localStorage.getItem('key'));
    user.isLogged = false;
    this.afs.doc(`users/${user.userId}`).set(user, { merge: true });
    localStorage.clear();
    this.router.navigate(['/']);
  }

  Authenticate(): boolean {
    let user = JSON.parse(localStorage.getItem('key'));
    if (user != null) {
      if (user.isLogged) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  isAdmin(): boolean {
    let user = JSON.parse(localStorage.getItem('key'));
    if (user != null) {
      if (user.isAdmin) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

}