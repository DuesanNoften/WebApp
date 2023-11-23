import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/ApiService/api.service';
import { SharedService } from '../services/SharedService/shared.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  friendImagesBlob = new Map<string, any>();

  userToShow = [{
    "user": "",
    "firstName": "",
    "lastName1": "",
    "lastName2": "",
    "nationality": ""
  }];
  friend = [{
    "user": "",
    "firstName": "",
    "lastName1": "",
    "lastName2": "",
    "birthDate": 0,
    "picture": ""
  }]
  userFound = [{
    "user": "",
    "firstName": "",
    "lastName1": "",
    "lastName2": "",
    "nationality": ""
  }];
  userToFind = "";

  constructor(
    private service: ApiService,
    private sharedService: SharedService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.friend.splice(0, this.friend.length);
    this.userFound.splice(0, this.userFound.length);
    this.userToShow.splice(0, this.userToShow.length);

    this.service.getFriends(this.sharedService.getUserData().User).subscribe(resp => {
      this.loadFriends(resp.body);
    })

    this.service.getFriendsAvailable(this.sharedService.getUserData().User).subscribe(resp => {
      this.loadUserFound(resp.body);
    });
  }

  loadFriends(friends: any) {
    for (let i of friends) {
      var date1: any = new Date(i.birthDate);
      var date2: any = new Date();
      this.friend.push({
        "user": i.user,
        "firstName": i.firstName,
        "lastName1": i.lastName1,
        "lastName2": i.lastName2,
        "birthDate": Math.floor((date2 - date1) / (1000 * 60 * 60 * 24 * 365)),
        "picture": i.picture
      });
    }
    for (let i of this.friend) {
      this.getImageFromService(i.picture, i.user);
    }
  }


  getImageFromService(imageUrl: string, user: string) {
    const path: any = { path: imageUrl };
    this.service.getUserImage(<JSON>path).subscribe({
      next: (data) => {
        this.createImageFromBlob(data, user);
      },
      error: (error) => {
        console.log(error);
        if (error.status == 401) {
          this.router.navigate(['/']);
          return;
        }
      }
    });
  }

  createImageFromBlob(image: Blob, user: string) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.friendImagesBlob.set(user, reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


  searchUser() {
    this.userToShow.splice(0, 1);

    for (let i of this.userFound) {

      if (this.userToFind.toLowerCase() == i.user.substr(0, this.userToFind.length).toLowerCase() && this.userToFind.length != 0) {

        this.userToShow.push({
          "user": i.user,
          "firstName": i.firstName,
          "lastName1": i.lastName1,
          "lastName2": i.lastName2,
          "nationality": i.nationality
        });
      }

    }
  }

  loadUserFound(user: any) {

    for (let i of user) {
      this.userFound.push({
        "user": i.user,
        "firstName": i.firstName,
        "lastName1": i.lastName1,
        "lastName2": i.lastName2,
        "nationality": i.nationality
      });
    }

  }
  follow(i: any) {

    this.service.addFriend(this.sharedService.getUserData().User, i.user).subscribe({
      next: (resp) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.log(error.error);
        if (error.status == 401) {
          this.router.navigate(['/']);
        }
      }
    });

  }
  deleteFriend(i: any) {
    this.service.delelteFriend(this.sharedService.getUserData().User, i.user).subscribe({
      next: (resp) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.log(error.error);
        if (error.status == 401) {
          this.router.navigate(['/']);
        }
      }
    });
  }


}
