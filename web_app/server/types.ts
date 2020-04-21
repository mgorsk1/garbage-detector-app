import moment from 'moment';

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

const days = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];

export const emptyTimeStats = (dateFrom: string): TimeStatistics => {
  const currentDate = moment();
  let date = moment(dateFrom, 'YYYY-MM-DD');
  let stats: DayStatistics[] = [];
  do {
    stats.push({ date: date.format('YYYY-MM-DD'), day: days[date.day()], ...emptyStats });
    date = date.add(1, 'days');
  } while (date < currentDate);

  return stats;
};

