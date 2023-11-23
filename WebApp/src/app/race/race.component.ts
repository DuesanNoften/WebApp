import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/ApiService/api.service';
import { SharedService } from '../services/SharedService/shared.service';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})


export class RaceComponent implements OnInit {

  public form!: FormGroup;
  alert: boolean = false;
  alertMessage: string = '';

  typeAlert: string = 'success';
  optionselect = '';
  voucher = '';
  id = 0;
  userid = '';
  start;
  category = '';
  type = '';
  grps = '';
  isPrivate: boolean = false;

  races = [{
    "Id": 0,
    "userAdmin": "",
    "name": "",
    "route": "",
    "privacy": "",
    "cost": 0,
    "category": "",
    "startDate": "",
    "activity_Type": ""
  }];

  visibility = [{
    "groupId": 0,
    "raceId": 0
  }];
  userGroups = [0];

  participants = [{
    "FirstName": "",
    "LastName": "",
    "Age": 0,
    "CategoryName": ""
  }]

  records = [{
    "FirstName": "",
    "LastName": "",
    "Age": 0,
    "Duration": "",
    "CategoryName": ""
  }]

  categories = [{
    "name": ""
  }];

  pay = [{
    "id": 0,
    "name": "",
    "cost": 0
  }];


  constructor(
    private service: ApiService,
    private formBuilder: FormBuilder,
    public sharedService: SharedService) { this.start = new Date(); }

  ngOnInit(): void {
      
    this.visibility.splice(0, 1);
    this.userGroups.splice(0, 1);
    this.races.splice(0, 1);

    this.service.getGroups(this.sharedService.getUserData().User).subscribe(resp => {
      this.loadUserGroups(resp.body)
    });

    this.service.getRaceVisibility().subscribe(resp => {
      this.loadVisivility(resp.body);
    })

    this.service.getRaces().subscribe(resp => {
      console.log(resp.body);
      for (let race of resp.body!) {
        this.loadRaces(race);
      }

    })

    this.form = this.formBuilder.group({
      UserAdmin: [this.sharedService.getToken(), [Validators.required]],
      Name: ['', [Validators.required]],
      Cost: ['', [Validators.required]],
      StartDate: [Date, [Validators.required]],
      Type: ['', [Validators.required]],
      Route: ['route.gpx', [Validators.required]],
      Privacy: ['', [Validators.required]],
      Groups: ['', []],
      GroupsArray: this.formBuilder.array([]),
      Category: ['', [Validators.required]]
    });

    console.log(this.id);
    this.participants.splice(0, 1);
    if (this.id != 0) {
      this.service.getParticipants(this.id).subscribe(resp => {
        console.log(resp.body);
        for (let participant of resp.body!) {
          this.loadParticipants(participant);
        }
      })
    }
    

    this.records.splice(0, 1);
    if (this.id != 0) {
      this.service.getRecord(this.id).subscribe(resp => {
        console.log(resp.body);
        for (let record of resp.body!) {
          this.loadRecords(record);
        }
      })
    }

    this.categories.splice(0, 1);
    if (this.id != 0) {
      this.service.getcategoriesforrace(this.id).subscribe(resp => {
        console.log(resp.body);
        for (let category of resp.body!) {
          this.loadcategoriesforrace(category);
        }
      })
    }

    this.pay.splice(0, 1);
    this.service.gettopay(this.sharedService.getUserData().User).subscribe(resp => {
      console.log(resp.body);
      for (let paid of resp.body!) {
        this.loadPay(paid);
      }
    })
    
  }



  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async printDiv(divName: any, name: any) {
    this.id = name;
    this.ngOnInit();
    await this.delay(1000);
    var printContents = document.getElementById('printableArea' + divName.toString())!.innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  async printRecord(divName: any, name: any) {
    this.id = name;
    this.ngOnInit();
    await this.delay(1000);
    var printContents = document.getElementById('Area' + divName.toString())!.innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  loadRaces(race: any) {
    let raceShown = [0];
    for (let vis of this.visibility) {

      if (race.privacy) {
        //if (this.userGroups.includes(vis.groupId) && race.id == vis.raceId && !raceShown.includes(race.id)) {
          this.races.push({
            "Id": race.id,
            "userAdmin": race.userAdmin,
            "name": race.name,
            "route": race.route,
            "privacy": race.privacy,
            "cost": race.cost,
            "category": race.category,
            "startDate": race.startDate,
            "activity_Type": race.activity_Type
          })
          raceShown.push(race.id)
          break;
        //}
      } else {
        this.races.push({
          "Id": race.id,
          "userAdmin": race.userAdmin,
          "name": race.name,
          "route": race.route,
          "privacy": race.privacy,
          "cost": race.cost,
          "category": race.category,
          "startDate": race.startDate,
          "activity_Type": race.activity_Type
        })
        raceShown.push(race.id)
        break;
      }
    }
  }

  loadUserGroups(grps: any) {
    for (let i of grps) {
      this.userGroups.push(i.id)
    }

  }

  loadcategoriesforrace(category: any) {
    this.categories.push({
      "name": category.name
    })
    console.log(this.categories);
  }

  loadParticipants(participant: any) {
    this.participants.push({
      "FirstName": participant.firstName,
      "LastName": participant.lastName,
      "Age": participant.age,
      "CategoryName": participant.category
    })
    console.log(this.participants);
  }

  loadRecords(record: any) {
    console.log(this.records);
    this.records.push({
      "FirstName": record.firstName,
      "LastName": record.lastName,
      "Age": record.age,
      "Duration": record.duration,
      "CategoryName": record.category
    })
    console.log(this.records);
  }

  loadVisivility(groups: any) {
    for (let i of groups) {
      this.visibility.push({
        "groupId": i.groupId,
        "raceId": i.raceId
      });
    }
  }

  loadPay(paid: any) {
    this.pay.push({
      "id": paid.id,
      "name": paid.name,
      "cost": paid.cost
    })
    console.log(this.pay);
  }


  getRace() {
    this.setgroups();
    this.setcategories();

    this.form.get('UserAdmin')!.setValue(this.sharedService.getUserData().User);
    this.form.get('StartDate')!.setValue(this.start);
    this.form.get('Category')!.setValue(this.category);
    this.form.get('Type')!.setValue(this.type);
    if (this.grps='') {
      this.form.get('Privacy')!.setValue(false);
    } else {
      this.form.get('Privacy')!.setValue(true);
    }
    

    delete this.form.value.GroupsArray;
    console.log(this.form.value)

    this.service.addRace(this.form.value).subscribe(resp => {
      console.log(resp);

    })
    window.location.reload();
    
  }
  setgroups() {

    for (let i of this.form.get('GroupsArray')?.value) {

      this.grps = this.grps + i.GroupsArray + ',';
    }
    delete this.form.value.GroupsArray;
    this.form.get('Groups')?.setValue(this.grps);
  }

  setcategories() {
    let auxcategories = this.category;
    this.category = '';
    for (let i of auxcategories) {

      this.category = this.category + i + ',';
    }
  }

  getFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      //this.form.get('Route')!.setValue(file);
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

  deleteGroup(i: number) {
    this.GroupsArray.removeAt(i);
  }

  get GroupsArray() {
    return this.form.get('GroupsArray') as FormArray;
  }
  addGroup() {
    const groupsFormGroup = this.formBuilder.group({
      GroupsArray: ''
    });
    this.GroupsArray.push(groupsFormGroup);
  }
  private() {
    this.isPrivate = !this.isPrivate;

    if (this.isPrivate) {
      this.addGroup();

    } else {
      this.GroupsArray.clear();
    }
  }
  
  async openForm(name: any) {
    console.log(this.sharedService.getUserData().User);
    this.id = name;
    this.ngOnInit();
    await this.delay(1000);

    document.getElementById("registerpopup")!.style.display = "block";
  }
  closeForm() {
    document.getElementById("registerpopup")!.style.display = "none";
    window.location.reload();
  }
  submitForm(){
    if(this.optionselect != '') {
      console.log(this.optionselect);
      this.service.getRaceRegister(this.sharedService.getUserData().User, this.id, this.optionselect).subscribe(resp => {
        console.log(resp.body);
      })
      document.getElementById("registerpopup")!.style.display = "none";
      window.location.reload();
    } else {
      console.log("Select category");
    }
    
  }

  payopenForm() {
    document.getElementById("paypopup")!.style.display = "block";
  }
  paycloseForm() {
    document.getElementById("paypopup")!.style.display = "none";
    window.location.reload();
  }
  paysubmitForm(raceid:any){
    console.log(this.voucher);
      this.service.getRacePay(raceid,this.sharedService.getUserData().User, this.voucher).subscribe(resp => {
        console.log(resp.body);
      })
      document.getElementById("paypopup")!.style.display = "none";
      window.location.reload();
  }

}
