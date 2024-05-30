import {action, computed, makeAutoObservable, observable} from "mobx";
 
 
 class UserStore {
    constructor(){
        makeAutoObservable(this)
    }
 }

 export const userStore = new UserStore()