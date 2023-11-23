import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/ApiService/api.service';
import { SharedService } from '../services/SharedService/shared.service';

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.css']
})
export class MyActivitiesComponent implements OnInit {
  public form!: FormGroup;
  public edit!: FormGroup;
  alert: boolean = false;
  alertMessage: string = '';
  
  
  typeAlert: string = 'success';
  data: any = [];
  activityType = '';
  start;
  duration;
  activityTypeUpdate = '';
  startUpdate;
  durationUpdate;
  fromChallenge = false;
  fromRace = false;
  RoCName = 'RoCName';
  RoC = 'RoC';

  RoCNameUpdate = 'Update';
  RoCUpdate = 'Update';

  idToUpdate = -1;

  activity = [{
    "actId":0,
    "UserId": "",
    "Name": "",
    "Distance": 0,
    "Start": "",
    "Duration": "",
    "Type": "",
    "Route": ""
  }];

  challenges = [{
    "Id": 0,
    "name": ""
  }];

  races = [{
    "Id":0,
    "name": ""
  }]
  fromChallengeUpdate= false;
  fromRaceUpdate= false;



  constructor(
    private formBuilder: FormBuilder,
    private service: ApiService,
    private sharedService: SharedService
  ) {
    this.start = new Date();
    this.duration = new Date();
    this.startUpdate = new Date();
    this.durationUpdate = new Date();
  }

  ngOnInit(): void {
    this.activity.splice(0, 1);
    this.challenges.splice(0, 1);
    this.races.splice(0, 1);
    this.form = this.formBuilder.group({
      UserId: [this.sharedService.getUserData().User, [Validators.required]],
      Name: ['', [Validators.required]],
      Distance: ['', [Validators.required]],
      Start: [Date, [Validators.required]],
      Duration: [Date, [Validators.required]],
      Type: ['', [Validators.required]],
      Route: ['', [Validators.required]]
    });

    this.edit = this.formBuilder.group({
      UserId: [this.sharedService.getUserData().User, [Validators.required]],
      Name: ['', [Validators.required]],
      Distance: ['', [Validators.required]],
      Start: [Date, [Validators.required]],
      Duration: [Date, [Validators.required]],
      Type: ['', [Validators.required]],
      Route: ['', [Validators.required]]
    });

    this.service.getUserActivities(this.sharedService.getUserData().User).subscribe(resp => {
      this.loadActivities(resp.body);
    })

    this.service.getChallengeByUser(this.sharedService.getUserData().User).subscribe(resp => {
      this.loadChallenges(resp.body);
    })

    this.service.getRacesByUser(this.sharedService.getUserData().User).subscribe(resp => {
      this.loadRaces(resp.body);
    })


  }

  loadActivities(activities: any) {
    for (let i of activities) {
      this.sharedService.addAct(i);
      this.activity.push({
        "actId":i.activityId,
        "UserId": i.userId,
        "Name": i.name,
        "Distance": i.distance,
        "Duration": i.duration.days + ':' + i.duration.hours + ':' + i.duration.minutes,
        "Route": i.route,
        "Start": i.start,
        "Type": i.type,
      })
    }

  }

  loadChallenges(challenge: any) {
    for (let i of challenge) {
      this.challenges.push({
        "Id": i.id,
        "name": i.name
      })
    }
  }

  loadRaces(race: any) {
    for (let i of race) {
      this.races.push({
        "Id": i.id,
        "name": i.name
      })
    }
  }

  challenge(event:any) {
    this.fromChallenge = !this.fromChallenge;
    this.fromRace = false;
    if (event.target.checked) {
      this.RoC=event.target.value
    } else {
      this.RoC='RoC'
    }
  }

  race(event:any) {
    this.fromRace = !this.fromRace;
    this.fromChallenge = false;
    if (event.target.checked) {
      this.RoC=event.target.value
    } else {
      this.RoC='RoC'
    }

  }

  getActivity() {

    this.form.get('Type')!.setValue(this.activityType);
    this.form.get('Start')!.setValue(this.start);
    this.form.get('Duration')!.setValue(this.duration);
    

    let formData: FormData = new FormData();

    formData.append('UserId', this.form.get('UserId')!.value);
    formData.append('Name', this.form.get('Name')!.value);
    formData.append('Distance', this.form.get('Distance')!.value);
    formData.append('Start', this.form.get('Start')!.value);
    formData.append('Duration', this.form.get('Duration')!.value);
    formData.append('Type', this.form.get('Type')!.value);
    formData.append('Route', this.form.get('Route')!.value);
    formData.append('Roc',  this.RoC);
    formData.append('RoCName', this.RoCName);
    
    
    
    
    this.service.addActivity(formData).subscribe(resp => {
      console.log(resp);
    })
  }


  getFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('Route')!.setValue(file);
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

  challengeUpdate(event:any) {
    this.fromChallengeUpdate = !this.fromChallengeUpdate;
    this.fromRaceUpdate = false;
    if (event.target.checked) {
      this.RoCUpdate=event.target.value
    } else {
      this.RoCUpdate='RoC'
    }
  }

  raceUpdate(event:any) {
    this.fromRaceUpdate = !this.fromRaceUpdate;
    this.fromChallengeUpdate = false;
    if (event.target.checked) {
      this.RoCUpdate=event.target.value
    } else {
      this.RoCUpdate='RoC'
    }

  }

  editActivity(i: any) {
    this.idToUpdate = i.actId;
    let actToEdit :any = this.sharedService.getUserAct(i.actId)

    this.edit.get('Name')?.setValue(actToEdit.Name);
    this.edit.get('Distance')?.setValue(actToEdit.Distance);
    this.edit.get('Start')?.setValue(actToEdit.Start);
    this.edit.get('Duration')?.setValue(actToEdit.Duration);
    this.edit.get('Type')?.setValue(actToEdit.Type);
    this.edit.get('Route')?.setValue(actToEdit.Route);
  }

  updateActivity() {
    console.log(this.idToUpdate);
    
    this.edit.get('Type')!.setValue(this.activityTypeUpdate);
    this.edit.get('Start')!.setValue(this.startUpdate);
    this.edit.get('Duration')!.setValue(this.durationUpdate);
    

    let formData: FormData = new FormData();

    formData.append('UserId', this.edit.get('UserId')!.value);
    formData.append('Name', this.edit.get('Name')!.value);
    formData.append('Distance', this.edit.get('Distance')!.value);
    formData.append('Start', this.edit.get('Start')!.value);
    formData.append('Duration', this.edit.get('Duration')!.value);
    formData.append('Type', this.edit.get('Type')!.value);
    formData.append('Route', this.edit.get('Route')!.value);
    formData.append('Roc',  this.RoCUpdate);
    formData.append('RoCName', this.RoCNameUpdate);

    console.log(this.edit.value);
    console.log(this.RoCUpdate);
    console.log(this.RoCNameUpdate);
    
    this.service.updateActivity(this.idToUpdate, formData).subscribe(resp => {
      console.log(resp);
      
    })
    
  }
  

}
