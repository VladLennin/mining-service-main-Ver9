import { action, computed, makeAutoObservable, observable } from "mobx";
import { User } from "../model/types";
import UserService from "../service/UserService";

class UserStore {
  user: User = {} as User;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async getUserById(id: number) {
    const res = await UserService.getUserById(id);
    const user = res.data;
    user.balance = parseFloat(user.balance);
    return user;
  }

  @action
  async withdrawBalance(userId: number, amount: number) {
    const res = await UserService.withdrawBalance(userId, amount);
    return res.data;
  }
}

export const userStore = new UserStore();
