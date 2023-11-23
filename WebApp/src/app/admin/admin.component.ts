import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/ApiService/api.service';
import { SharedService } from '../services/SharedService/shared.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  


  generatePDF() {
    let doc = new jsPDF();
    let data: any[] = [
      { Nombre: 'John', Apellido: 'Doe', Tiempo: '00:30:00', Categoría: 'Open' },
      { Nombre: 'Jane', Apellido: 'Doe', Tiempo: '00:35:00', Categoría: 'Elite' },
      { Nombre: 'Juan', Apellido: 'Perez', Tiempo: '00:40:00', Categoría: 'Open' },
      { Nombre: 'Pedro', Apellido: 'Gonzalez', Tiempo: '00:45:00', Categoría: 'Elite' },
      { Nombre: 'Maria', Apellido: 'Gonzalez', Tiempo: '00:50:00', Categoría: 'Open' },
      { Nombre: 'Jose', Apellido: 'Perez', Tiempo: '00:55:00', Categoría: 'Elite' },
      { Nombre: 'Luis', Apellido: 'Gonzalez', Tiempo: '01:00:00', Categoría: 'Open' },
      { Nombre: 'Ana', Apellido: 'Perez', Tiempo: '01:05:00', Categoría: 'Elite' },
      { Nombre: 'Carlos', Apellido: 'Gonzalez', Tiempo: '01:10:00', Categoría: 'Open' }
    ];
    let title = 'Reporte ';

    doc.text(title, 10, 10);
  
    autoTable(doc, {
      margin: { top: 20 },
      head: [['Nombre', 'Apellido', 'Tiempo', 'Categoría']],
      body: data.map(item => [item.Nombre, item.Apellido, item.Tiempo, item.Categoría])
    });
  
    doc.save('data.pdf');
  }
  


  alert: boolean = false;
  alertMessage: string = '';

  typeAlert: string = 'success';
  public form!: FormGroup;
  challenges = [{
    "Id":0,
    "userAdmin": "",
    "name": "",
    "class": "",
    "privacy": "",
    "startDate": "",
    "endDate": "",
    "activity_Type": "",
    "objective":0,
    "progress": 0,
    "status":""
  }];
  availableChallenges = [{
    "Id":0,
    "userAdmin": "",
    "name": "",
    "class": "",
    "privacy": "",
    "startDate": "",
    "endDate": "",
    "activity_Type": "",
    "objective":0
  }];
  challengesToShow = [{
    "Id":0,
    "userAdmin": "",
    "name": "",
    "class": "",
    "privacy": "",
    "startDate": "",
    "endDate": "",
    "activity_Type": "",
    "objective":0
  }];
  progress = 0;
  userGroups=[0];
  visibility=[{
    "groupId":0,
    "challengeId": 0
  }];
  isPrivate=false;
  start;
  end;
  category='';
  type='';
  grps = '';
  challengeToFind='';

  constructor(
    private service: ApiService,
    public sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router) {this.start=new Date(); this.end=new Date(); }

  ngOnInit(): void {
    this.challenges.splice(0, 1);
    this.availableChallenges.splice(0, 1);
    this.userGroups.splice(0, 1);
    this.visibility.splice(0, 1);
    this.challengesToShow.splice(0, 1);


    this.service.getGroups(this.sharedService.getUserData().User).subscribe(resp => {
      
      
      this.loadUserGroups(resp.body)
    });

    this.service.getChallengeVisibility().subscribe(resp => {
      
      this.loadVisivility(resp.body);
    })

    this.service.getChallengeByUser(this.sharedService.getUserData().User).subscribe(resp => {
      this.loadChallengeProgress(resp.body);
      
    })

    this.service.getChallenges().subscribe({
      next: (resp) => {
        
        for (let challenge of resp.body!) {
          this.loadAvailableChallenges(challenge);
        }
      }, error: (error) => {
        console.log(error);
        if (error.status == 401) {
          this.router.navigate(['/']);
        }
      }
    });

    this.form = this.formBuilder.group({
      User: [this.sharedService.getToken(), [Validators.required]],
      Name: ['', [Validators.required]],
      
      StartDate: [Date, [Validators.required]],
      EndDate: [Date, [Validators.required]],
      Activity_Type: ['', [Validators.required]],
      
      Privacy: ['', [Validators.required]],
      Group: ['', []],
      GroupsArray: this.formBuilder.array([]),
      Class: ['', [Validators.required]],
      Objective: ['', [Validators.required]]
    });
    

  }   

  loadUserGroups(grps: any){
    for(let i of grps){
      this.userGroups.push(i.id)
    }
    console.log(this.userGroups);
  }
  loadVisivility(groups:any){
    for(let i of groups){
      this.visibility.push({
        "groupId":i.groupId,
        "challengeId":i.challengeId
      });
    }
  }

  loadChallengeProgress(activechallenges: any) {
    for (let i of activechallenges) {
      this.service.getChallengeProgress(i.id, this.sharedService.getUserData().User).subscribe(resp => {
        
        this.loadActiveChallenges(i, Number(resp.body))
      })
    }
  }

  loadActiveChallenges(i: any, progress: any) {
    
    if (progress > i.objective) {
      this.challenges.push({
        "Id": i.id,
        "userAdmin": i.userAdmin,
        "name": i.name,
        "class": i.class,
        "privacy": i.privacy,
        "startDate": i.startDate,
        "endDate": i.endDate,
        "activity_Type": i.activity_Type,
        "objective":i.objective,
        "progress": (progress / i.objective) * 100,
        "status":"Challege Completed"
      })
    } else {
      this.challenges.push({
        "Id": i.id,
        "userAdmin": i.userAdmin,
        "name": i.name,
        "class": i.class,
        "privacy": i.privacy,
        "startDate": i.startDate,
        "endDate": i.endDate,
        "activity_Type": i.activity_Type,
        "objective":i.objective,
        "progress": (progress / i.objective) * 100,
        "status":"Unfinished, your progress: "+String(progress)
      })
    }
    
    
    
    console.log(this.challenges);
  }

  loadAvailableChallenges(challenge: any) {
    let challengeShown=[0];
    for(let vis of this.visibility){
      if(challenge.privacy){
        if(this.userGroups.includes(vis.groupId) && challenge.id==vis.challengeId && !challengeShown.includes(challenge.id)){
          this.availableChallenges.push({
            "Id": challenge.id,
            "userAdmin": challenge.userAdmin,
            "name": challenge.name,
            "class": challenge.class,
            "privacy": challenge.privacy,
            "startDate": challenge.startDate,
            "endDate": challenge.endDate,
            "activity_Type": challenge.activity_Type,
            "objective":challenge.objective
          })
          challengeShown.push(challenge.id)
        }
      }else{
        this.availableChallenges.push({
          "Id": challenge.id,
          "userAdmin": challenge.userAdmin,
          "name": challenge.name,
          "class": challenge.class,
          "privacy": challenge.privacy,
          "startDate": challenge.startDate,
          "endDate": challenge.endDate,
          "activity_Type": challenge.activity_Type,
          "objective":challenge.objective
        })
        challengeShown.push(challenge.id)
      }
      
    }
  }

  searchChallenge() {
    this.challengesToShow.splice(0, this.challengesToShow.length)
    let count = 0;
    for(let i of this.availableChallenges){
      if (this.challengeToFind.toLocaleLowerCase() == i.name.substr(0, this.challengeToFind.length).toLocaleLowerCase() &&
      this.challengeToFind.toLocaleLowerCase() !=this.challenges[count].name.substr(0, this.challengeToFind.length).toLocaleLowerCase()) {
        this.challengesToShow.push({
          "Id": i.Id,
          "userAdmin": i.userAdmin,
          "name": i.name,
          "class": i.class,
          "privacy": i.privacy,
          "startDate": i.startDate,
          "endDate": i.endDate,
          "activity_Type": i.activity_Type,
          "objective":i.objective
        })
      }
    }
  }

  getInChallenge(i: any){
    
    this.service.getInChallenge(this.sharedService.getUserData().User, i.Id).subscribe(resp=>{
      console.log(resp);
    })

    this.challenges.push({
      "Id": i.Id,
      "userAdmin": i.userAdmin,
      "name": i.name,
      "class": i.class,
      "privacy": i.privacy,
      "startDate": i.startDate,
      "endDate": i.endDate,
      "activity_Type": i.activity_Type,
      "progress": this.progress,
      "objective": i.objective,
      "status":"Unfinished"
    })
    for(let grp in this.challengesToShow){
      if(this.challengesToShow[grp].Id==i.Id){
        this.challengesToShow.splice(Number(grp),1);
      }
    }
  }

  riseAlert(message: string, type: string) {
    this.alertMessage = message;
    this.typeAlert = type;
    this.alert = true;
  }

  closeAlert() {
    this.alert = false
  }

  private(){
    this.isPrivate=!this.isPrivate;
    
    console.log(this.isPrivate);
    
    if(this.isPrivate){
      this.addGroup();
      
    }else{
      this.GroupsArray.clear();
    }
  }

  ceateChallenge(){
    this.setgroups();

    this.form.get('Privacy')!.setValue(this.isPrivate);
    this.form.get('StartDate')!.setValue(this.start);
    this.form.get('EndDate')!.setValue(this.end);
    this.form.get('Class')!.setValue(this.category);
    this.form.get('Activity_Type')!.setValue(this.type);

    delete this.form.value.GroupsArray;
    console.log(this.form.value);

    this.service.registerChallenge(this.form.value).subscribe(resp=>{
      console.log(resp);
      
    })
    

  }

  setgroups(){
    
    for(let i of this.form.get('GroupsArray')?.value){
      
      this.grps=this.grps+i.GroupsArray+',';
    }
    delete this.form.value.GroupsArray;
    this.form.get('Groups')?.setValue(this.grps);
  }

  get GroupsArray(){
    return this.form.get('GroupsArray') as FormArray; 
  }

  addGroup(){
    const groupsFormGroup= this.formBuilder.group({
      GroupsArray: ''
    });
    this.GroupsArray.push(groupsFormGroup);
  }
  deleteGroup(i: number){
    this.GroupsArray.removeAt(i);
  }

  getActId() {
    this.form.get('Route')?.setValue('route.gpx');
    this.service.getActivityId(this.form.value).subscribe(resp => {
      console.log(resp);
      for (let i of this.challenges) {
      }
    });
  }

}