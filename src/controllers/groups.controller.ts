import { bind } from "@/di/container";
import { BaseController } from "./base.controller";
import { inject } from "inversify";
import { Endpoint } from "./types/endpoint";

@bind("GroupsController")
export class GroupsController extends BaseController {
  // eslint-disable-next-line max-params
  constructor(
    @inject("ListGroupsEndpoint") listGroupsEndpoint: Endpoint<any>,
    @inject("GetGroupEndpoint") getGroupEndpoint: Endpoint<any>,
    @inject("CreateGroupEndpoint") createGroupEndpoint: Endpoint<any>,
    @inject("AddUserToGroupEndpoint") addUserToGroupEndpoint: Endpoint<any>,
    @inject("RemoveUserFromGroupEndpoint")
    removeUserFromGroupEndpoint: Endpoint<any>,
    @inject("DeleteGroupEndpoint") deleteGroupEndpoint: Endpoint<any>,
  ) {
    super("/groups", [
      listGroupsEndpoint,
      getGroupEndpoint,
      createGroupEndpoint,
      addUserToGroupEndpoint,
      removeUserFromGroupEndpoint,
      deleteGroupEndpoint,
    ]);
  }
}
