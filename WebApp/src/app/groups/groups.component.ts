import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/ApiService/api.service';
import { SharedService } from '../services/SharedService/shared.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups=[{
    "Id":0,
    "AdminUser":"",
    "Name":""
  }];

  availableGroups=[{
    "Id":0,
    "AdminUser":"",
    "Name":""
  }];
  groupToSHow=[{
    "Id":0,
    "AdminUser":"",
    "Name":""
  }];

  groupToSearch="";
  newGroup="";
  constructor(
    private service: ApiService,
    private sharedService: SharedService
    ) { }

  ngOnInit(): void {
    this.groups.splice(0,this.groups.length);
    this.availableGroups.splice(0,this.availableGroups.length);
    this.groupToSHow.splice(0,this.groupToSHow.length);
    this.service.getGroupsAvailable(this.sharedService.getUserData().User).subscribe(resp=>{
      
      this.loadGroupsAvailable(resp.body)
    });

    this.service.getGroups(this.sharedService.getUserData().User).subscribe(resp=>{
      
      this.loadGroups(resp.body)
      
    })
  }

  loadGroupsAvailable(grps:any){
    for(let i of grps){
      this.availableGroups.push({
        "Id":i.id,
        "AdminUser":i.adminUser,
        "Name":i.name
      });
    }
  }

  loadGroups(grps:any){
    for(let i of grps){
      this.groups.push({
        "Id":i.id,
        "AdminUser":i.adminUser,
        "Name":i.name
      });
    }
  }


  quitGroup(i:any){
    this.service.quitGroup(i.Id,this.sharedService.getUserData().User).subscribe(resp=>{
      console.log(resp);
    })
    for(let grp in this.groups){
      if(this.groups[grp].Id==i.Id){
        this.groups.splice(Number(grp),1);
      }
    }

    //this.ngOnInit();
  }

  searchGroup(){
    this.groupToSHow.splice(0,this.groupToSHow.length)
    for(let i of this.availableGroups){
      if(this.groupToSearch.toLocaleLowerCase()==i.Name.substr(0,this.groupToSearch.length).toLocaleLowerCase()){
        this.groupToSHow.push({
          "Id":i.Id,
          "AdminUser":i.AdminUser,
          "Name":i.Name
        })
      }
    }

  }
  getIn(i:any){
    this.service.joinGroup(i.Id,this.sharedService.getUserData().User).subscribe(resp=>{
      
    })
    for(let grp in this.groupToSHow){
      if(this.groupToSHow[grp].Id==i.Id){
        this.groupToSHow.splice(Number(grp),1);
      }
    }
    //this.ngOnInit();
    this.groups.push({
      "Id":i.Id,
      "AdminUser":i.AdminUser,
      "Name":i.Name
    })
  }
  createGroup(){
    this.service.createGroup(this.sharedService.getUserData().User, this.newGroup).subscribe(resp=>{
      console.log(resp);
      
    })
  }
}
