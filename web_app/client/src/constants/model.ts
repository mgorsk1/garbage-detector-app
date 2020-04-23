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

export interface DayStatistics extends Statistics {
  date: string;
  day: string;
}

export type TimeStatistics = DayStatistics[];

export const emptyTimeStats: TimeStatistics = [];

export interface DayProgress {
  date: string;
  day: string;
  points: number;
}

export type ProgressStatistics = DayProgress[];

export const emptyProgressStats: ProgressStatistics = [];
