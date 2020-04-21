export type GarbageClass = 'paper' | 'plastic' | 'glass' | 'rest';

export interface Message {
  user: string;
  image: string;
  class: GarbageClass;
}

export type Statistics = {
  [garbageClass in GarbageClass]: number;
};

export const emptyStats: Statistics = {
  glass: 0,
  paper: 0,
  plastic: 0,
  rest: 0
};

export interface DayStatistics {
  date: string;
  points: number;
}

export type TimeStatistics = {
  [garbageClass in GarbageClass]: DayStatistics[];
}

export const emptyTimeStats: TimeStatistics = {
  glass: [],
  paper: [],
  plastic: [],
  rest: [],
};