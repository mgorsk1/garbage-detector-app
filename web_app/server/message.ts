type GarbageClass = 'paper' | 'plastic' | 'glass' | 'rest';

export interface Message {
  user: string;
  image: string;
  class: GarbageClass;
}