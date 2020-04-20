type GarbageClass = 'paper' | 'plastic' | 'glass' | 'rest';

export interface Message {
  user: string;
  image: string;
  class: GarbageClass;
}

export type Statistics = {
  [user: string]: UserStatistics;
}

export type UserStatistics = {
  [garbageClass in GarbageClass]: number;
};

export const emptyUserStats: UserStatistics = {
  glass: 0,
  paper: 0,
  plastic: 0,
  rest: 0
};