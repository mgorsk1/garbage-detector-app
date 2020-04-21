import { colors } from "../App.styles";

export enum WsStatus {
  Closed,
  Connecting,
  Connected,
  Error,
}

export enum Category {
  Paper = 0,
  Metal = 1,
  Rest = 2,
  Glass = 3,
}

export const Categories = {
  [Category.Paper]: {
    name: "paper",
    phrase: "Paper makes the world go round.",
    color: colors.navy,
    image:
      "https://cdn.dribbble.com/users/548267/screenshots/5708108/adobe-winter-tutorial.jpg",
    points: 64,
  },
  [Category.Metal]: {
    name: "metal",
    phrase: "Heavy metal! Rock on!",
    color: colors.purple,
    image:
      "https://cdn.dribbble.com/users/548267/screenshots/7009894/media/7c195a7fbbdb8faee533f8324219d399.jpg",
    points: 32,
  },
  [Category.Rest]: {
    name: "rest",
    phrase: "Save the rest for last.",
    color: colors.navy,
    image:
      "https://cdn.dribbble.com/users/548267/screenshots/4157340/woodsy-landscape-2.jpg",
    points: 22,
  },
  [Category.Glass]: {
    name: "glass",
    phrase: "Glassy for real, right?",
    color: colors.pink,
    image:
      "https://cdn.dribbble.com/users/548267/screenshots/4186058/reece-collab-v1.jpg",
    points: 80,
  },
  default: {
    name: "uhhh",
    color: colors.green,
    phrase: "Not sure...",
    image: "",
    points: 0,
  },
};
