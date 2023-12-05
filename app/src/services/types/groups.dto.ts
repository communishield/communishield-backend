// eslint-disable-next-line @typescript-eslint/ban-types
export type ListGroupsDto = {};

export type GetGroupDto = {
  name: string;
};

export type CreateGroupDto = {
  name: string;
};

export type AddUserToGroupDto = {
  groupName: string;
  username: string;
};

export type RemoveUserFromGroupDto = {
  groupName: string;
  username: string;
};

export type DeleteGroupDto = {
  name: string;
};
