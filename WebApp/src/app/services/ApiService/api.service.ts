import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyForUntypedForms } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from '../SharedService/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,
    private sharedService: SharedService) { }

  getChallenges() {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/challenges', { headers: header, observe: 'response' });
  }

  getInChallenge(user: string, challengeId: number) {
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post('https://straviatec-api.azurewebsites.net/getInChallenge/' + user + '/' + challengeId, { headers: header, responseType: 'blob' });
  }

  getChallengeVisibility() {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/ChallengeVisibility', { headers: header, observe: 'response' });
  }

  getChallengeByUser(user: any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/challengesByUser/' + user, { headers: header, observe: 'response' });
  }

  getChallengeProgress(challengeId: any, user: any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/ChallengeProgress/'+challengeId+'/' + user, { headers: header, observe: 'response' });
  }

  getActivityId(activity: any) {
    let header = new HttpHeaders().set('Type-contet', 'multipart/form-data');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post<JSON[]>('https://straviatec-api.azurewebsites.net/getActivityId', activity, { headers: header, observe: 'response' });
  }
  addChallengeActivity(challId: number, actId: number) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post<JSON[]>('https://straviatec-api.azurewebsites.net/AddChallengeActivity/' + challId + '/' + actId, { headers: header, observe: 'response' });
  }

  registerChallenge(challenge: any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post('https://straviatec-api.azurewebsites.net/challenges', challenge, { headers: header, observe: 'response' });
  }

  getRaces() {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/races', { headers: header, observe: 'response' });
  }

  getRaceVisibility(){
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/RaceVisibility', { headers: header, observe: 'response' });
  }

  getUser(user: string) {
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get('https://straviatec-api.azurewebsites.net/users/' + user, { headers: header, observe: 'response' });
  }

  getUserImage(imagePath: JSON): Observable<Blob> {
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post('https://straviatec-api.azurewebsites.net/userImage', imagePath, { headers: header, responseType: 'blob' });
  }

  registerUser(user: FormData) {
    let header = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    return this.http.post('https://straviatec-api.azurewebsites.net/register', user, { headers: header, observe: 'response' });
  }

  loginUser(user: JSON) {
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('https://straviatec-api.azurewebsites.net/login', user, { headers: header, observe: 'response' });
  }

  GetFriendsFrontPage(user: string) {
    let header = new HttpHeaders().set('Type-contet', 'multipart/form-data');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/friendsFrontPage/' + user, { headers: header, observe: 'response' });
  }
  getFriends(user: string) {
    let header = new HttpHeaders().set('Type-contet', 'multipart/form-data');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/friends/' + user, { headers: header, observe: 'response' });
  }

  getFriendsAvailable(user: string) {
    let header = new HttpHeaders().set('Type-contet', 'multipart/form-data');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/friendsAvailable/' + user, { headers: header, observe: 'response' });
  }
  addFriend(user: string, friend: string) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    return this.http.post('https://straviatec-api.azurewebsites.net/addFriend/' + user + '/' + friend, { headers: header, observe: 'response' });
  }

  delelteFriend(user: any, friend: any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    return this.http.delete('https://straviatec-api.azurewebsites.net/friends/Delete/' + user + '/' + friend, { headers: header, observe: 'response' })
  }

  updateUser(user: FormData) {
    let header = new HttpHeaders().set('Type-contet', 'multipart/form-data');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.put('https://straviatec-api.azurewebsites.net/edit', user, { headers: header, observe: 'response' });
  }

  addActivity(activity: FormData) {
    let header = new HttpHeaders().set('Type-contet', 'multipart/form-data');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post('https://straviatec-api.azurewebsites.net/addActivity', activity, { headers: header, observe: 'response' });
  }

  updateActivity(actId:any,activity:FormData) {
    let header = new HttpHeaders().set('Type-contet', 'multipart/form-data');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.put('https://straviatec-api.azurewebsites.net/UpdateActivity/'+actId, activity, { headers: header, observe: 'response' });
  }

  getUserActivities(user: string) {
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get('https://straviatec-api.azurewebsites.net/userActivities/' + user, { headers: header, observe: 'response' });
  }

  addRace(race:string) {
    let header = new HttpHeaders().set('Type-contet', 'multipart/form-data');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post('https://straviatec-api.azurewebsites.net/reraces', race, { headers: header, observe: 'response' });
  }

  deleteUser(user: string) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.delete('https://straviatec-api.azurewebsites.net/delete/' + user, { headers: header, observe: 'response' });
  }

  getGroups(user:string){
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get('https://straviatec-api.azurewebsites.net/groups/' + user, { headers: header, observe: 'response' });
  }

  getGroupsAvailable(user:string){
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get('https://straviatec-api.azurewebsites.net/groupsAvailable/' + user, { headers: header, observe: 'response' });
  }

  joinGroup(id:number, user:string){
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post('https://straviatec-api.azurewebsites.net/joinGroup/'+id+'/'+user, { headers: header, observe: 'response' });
  }

  quitGroup(id:number, user:string){
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.delete('https://straviatec-api.azurewebsites.net/quitGroup/'+id+'/'+user, { headers: header, observe: 'response' });
  }

  createGroup(user:string, grpName:string){
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post('https://straviatec-api.azurewebsites.net/createGroup/'+user+'/'+grpName, { headers: header, observe: 'response' });
  }

  getActivityRoute(routePath: JSON) {
    let header = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.post('https://straviatec-api.azurewebsites.net/activityRoute', routePath, { headers: header, observe: 'response' });}

  getParticipants(name:any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/Participants/'+name, { headers: header, observe: 'response' });
  }

  getRecord(name:any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/Record/'+name, { headers: header, observe: 'response' });
  }

  getcategoriesforrace(name:any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/CategoryRace/'+name, { headers: header, observe: 'response' });
  }

  getRaceRegister(User:any,id:any,optionselect:any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/RaceRegister/'+User+'/'+id+'/'+optionselect, { headers: header, observe: 'response' });
  }

  gettopay(User:any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/ToPay/'+User, { headers: header, observe: 'response' });
  }

  getRacePay(id:any,user:any,Payment:any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/Pay/'+id+'/'+user+'/'+Payment, { headers: header, observe: 'response' });
  }

  getRacesByUser(user: any) {
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    header = header.set('Authorization', 'Bearer ' + this.sharedService.getToken());
    return this.http.get<JSON[]>('https://straviatec-api.azurewebsites.net/racesByUser/'+user, { headers: header, observe: 'response' });
  }

}
