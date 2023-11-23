import { Injectable } from '@angular/core';


@Injectable()
export class SharedService {
    globalToken;
    globalUserData;

    userActivity;

    constructor() {
        this.globalToken = '';
        this.globalUserData = {
            "User": 'sfv',
            "FirstName": '',
            "LastName1": '',
            "LastName2": '',
            "BirthDate": '',
            "Picture": '',
            "Nationality": ''
        };

        this.userActivity = [{
            "actId": 0,
            "UserId": "",
            "Distance": 0,
            "Start": "",
            "Duration": "",
            "Type": "",
            "Route": ""
        }]
    }

    setToken(val: string) {
        this.globalToken = val;
    }

    getToken() {
        return this.globalToken;
    }

    getUserData() {
        return this.globalUserData;
    }

    getUserAct(id:any) {
        for (let i of this.userActivity) {
            if (i.actId == id) {
                return i;
            }
        }

        return this.userActivity;
    }
    addAct(i: any) {
        this.userActivity.push({
            "actId": i.activityId,
            "UserId": i.userId,
            "Distance": i.distance,
            "Duration": i.duration.days + ':' + i.duration.hours + ':' + i.duration.minutes,
            "Route": i.route,
            "Start": i.start,
            "Type": i.type,
        })
    }
}
