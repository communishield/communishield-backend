import { bind } from "@/di/container";
import { inject } from "inversify";
import { Endpoint } from "./types/endpoint";
import { BaseController } from "./base.controller";

@bind("GroupController")
export class GroupController extends BaseController {
  // eslint-disable-next-line max-params
  constructor(
    @inject("AddUserToGroupEndpoint") addUserToGroupEndpoint: Endpoint<any>,
    @inject("RemoveUserFromGroupEndpoint")
    removeUserFromGroupEndpoint: Endpoint<any>,
    @inject("NewGroupEndpoint") newGroupEndpoint: Endpoint<any>,
    @inject("ListGroupsEndpoint") listGroupsEndpoint: Endpoint<any>,
    @inject("GetGroupEndpoint") getGroupEndpoint: Endpoint<any>,
    @inject("DeleteGroupEndpoint") deleteGroupEndpoint: Endpoint<any>,
  ) {
    super("/api/v1/groups", [
      addUserToGroupEndpoint,
      removeUserFromGroupEndpoint,
      newGroupEndpoint,
      listGroupsEndpoint,
      getGroupEndpoint,
      deleteGroupEndpoint,
    ]);
  }
}
