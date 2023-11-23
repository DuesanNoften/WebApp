import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiMongoService } from '../services/ApiMongo/api-mongo.service';
import { ApiService } from '../services/ApiService/api.service';
import { SharedService } from '../services/SharedService/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {

  constructor(
    private service: ApiService,
    public sharedService: SharedService,
    private mongoService: ApiMongoService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  userImage: any;
  isImageLoading = false;
  data: any = [];

  activities = [{
    "id": 0,
    "User": "",
    "FirstName": "",
    "LastName1": "",
    "LastName2": "",
    "Type": "",
    "Start": "",
    "Route": "",
    "Distance": 0
  }];
  comments = [{
    "id": 0,
    "user": "",
    "activityId": "",
    "postTime": "",
    "body": ""
  }];
  activityNumber = -1;
  ngOnInit(): void {
    this.activities.splice(0, 1);
    this.comments.splice(0, 1);

    // solicita y carga la informacion del usuario
    // y luego carga la imagen
    this.service.getUser(this.sharedService.getUserData().User).subscribe({
      next: (resp) => {
        this.data = <JSON>resp.body;
        this.sharedService.getUserData().FirstName = this.data.firstName;
        this.sharedService.getUserData().LastName1 = this.data.lastName1;
        this.sharedService.getUserData().LastName2 = this.data.lastName2;
        this.sharedService.getUserData().BirthDate = this.data.birthDate;
        this.sharedService.getUserData().Picture = this.data.picture;
        this.sharedService.getUserData().Nationality = this.data.nationality;
        this.getImageFromService(this.sharedService.getUserData().Picture);
      },
      error: (error) => {
        console.log(error);
        if (error.status == 401) {
          this.router.navigate(['/']);
        }
      }
    });

    this.service.GetFriendsFrontPage(this.sharedService.getUserData().User).subscribe({
      next: (resp) => {
        for (let i of resp.body!) {
          this.loadActivity(i);
        }
      },
      error: (error) => {
        console.log(error);
        if (error.status == 401) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  loadActivity(acts: any) {

    this.activities.push({
      "id": acts.id,
      "User": acts.user,
      "FirstName": acts.firstName,
      "LastName1": acts.lastName1,
      "LastName2": acts.lastName2,
      "Type": acts.type,
      "Start": acts.start,
      "Route": acts.route,
      "Distance": acts.distance
    })
  }

  getCommentsByActivity(i: number) {
    this.activityNumber = this.activities[i].id;
    this.mongoService.getCommentsByActivity(this.activities[i].id).subscribe({
      next: (resp) => {
        for (let i of resp.body!) {
          this.showComments(i);
        }
      },
      error: (error) => {
        console.log(error);
        if (error.status == 401) {
          this.router.navigate(['/']);
          return;
        }
      }
    })
  }
  showComments(comment: any) {
    this.comments.push({
      "id": comment.id,
      "user": comment.user,
      "activityId": comment.activityId,
      "postTime": comment.postTime,
      "body": comment.body
    })
    var postTime = new Date();
    const cValue = formatDate(postTime, 'yyyy-MM-ddTHH:mm:SS', 'en-US');

  }
  hideComments() {
    this.comments.splice(0, this.comments.length);
  }


  addComment(comment: any) {
    var postTime = new Date();
    const cValue = formatDate(postTime, 'yyyy-MM-ddTHH:mm:SS', 'en-US');
    var newComment = {
      "user": this.sharedService.getUserData().User,
      "activityId": this.activityNumber,
      "postTime": cValue + "Z",
      "body": comment
    }

    if (comment == '') {
      return;
    } else {
      this.mongoService.postComments(newComment).subscribe(resp => {
        console.log('comment resp: ' + resp);
      })
      this.showComments(newComment);
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.userImage = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromService(imageUrl: string) {
    this.isImageLoading = true;
    const path: any = { path: imageUrl };
    this.service.getUserImage(<JSON>path).subscribe({
      next: (data) => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      },
      error: (error) => {
        this.isImageLoading = true;
        console.log(error);
        if (error.status == 401) {
          this.router.navigate(['/']);
          return;
        }
      }
    });
  }

  editUser() {
    this.router.navigate(['/editUser']);
  }


}
