import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiMongoService {

  constructor(private http: HttpClient) { }

  getComments(user: string){
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    return this.http.get<JSON[]>('http://localhost:5001/Comments/byUser/'+user, { headers: header, observe: 'response' });
  }

  postComments(comment: any){
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    return this.http.post<JSON[]>('http://localhost:5001/Comments/add',comment, { headers: header, observe: 'response' });
  }
  getCommentsByActivity(activityId: any){
    let header = new HttpHeaders().set('Type-contet', 'aplication/json');
    return this.http.get<JSON[]>('http://localhost:5001/Comments/byActivity/'+activityId, { headers: header, observe: 'response' });
  }
}
