import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/SharedService/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private sharedService: SharedService,
    private router: Router) { }

  ngOnInit(): void {
  }
  home(){
    this.router.navigate(['/home']);
  }
  challenge(){
    this.router.navigate(['/challenge']);
  }
  race() {
    this.router.navigate(['/race']);
  }
  myAct() {
    this.router.navigate(['/myAct']);
  }
  friends() {
    this.router.navigate(['/friends']);
  }
  groups() {
    this.router.navigate(['/groups']);
  }
  LogOut() {
    this.sharedService.getUserData().User = '';
    this.sharedService.setToken('');
    this.router.navigate(['/']);
  }

}
