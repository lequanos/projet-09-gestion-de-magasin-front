export type GetUserStatsResponse = {
  activeUsersCount: number;
  usersCount: number;
  progression: number;
  [key: string]: number;
};
