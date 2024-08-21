import { $api } from "../../../http";

export default class UserService {
  static async getUserById(id: number) {
    return $api.get("/user", {
      params: {
        id,
      },
    });
  }

  static async withdrawBalance(userId: number, amountToWithdraw:number) {
    return $api.post("/withdraw", {userId,amountToWithdraw});
  }
}
