import { colors } from "../App.styles";

export enum WsStatus {
  Closed,
  Connecting,
  Connected,
  Error,
}

export class Category {
  static paper = "paper";
  static plastic = "plastic";
  static rest = "rest";
  static glass = "glass";
}

export const Categories = {
  [Category.paper]: (points: any) => ({
    name: "paper",
    phrase: "Paper makes the world go round.",
    color: colors.green,
    image: "https://images.unsplash.com/photo-1488330890490-c291ecf62571?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    points,
  }),
  [Category.plastic]: (points: any) => ({
    name: "plastic",
    phrase: "Heavy metal! Rock on!",
    color: colors.navy,
    image: "https://images.unsplash.com/photo-1559825481-12a05cc00344?ixlib=rb-1.2.1&auto=format&fit=crop&w=701&q=80",
    points,
  }),
  [Category.rest]: (points: any) => ({
    name: "rest",
    phrase: "Save the rest for last.",
    color: colors.grey,
    image: "https://images.unsplash.com/photo-1577943702590-8b3a1b5cf96b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    points,
  }),
  [Category.glass]: (points: any) => ({
    name: "glass",
    phrase: "Glassy for real, right?",
    color: colors.brown,
    image: "https://images.unsplash.com/photo-1566997257669-fc1fc97aa6e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80",
    points,
  }),
  default: () => ({
    name: "uhhh",
    color: colors.green,
    phrase: "Not sure...",
    image: "",
    points: 0,
  }),
};
