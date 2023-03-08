import {
  Fastfood,
  LocalPizza,
  LunchDining,
  RamenDining,
  RestaurantMenu,
  SoupKitchen,
  Tapas,
  Icecream,
  Cake,
} from "@mui/icons-material";

export const MENU_ITEMS = [
  {
    name: "Appetizers",
    category: "appetizers",
    icon: <Tapas />,
  },
  {
    name: "Soup",
    category: "soup",
    icon: <SoupKitchen />,
  },
  {
    name: "Salad",
    category: "salad",
    icon: <RestaurantMenu />,
  },
  {
    name: "Pizza",
    category: "pizza",
    icon: <LocalPizza />,
  },
  {
    name: "Pasta",
    category: "pasta",
    icon: <RamenDining />,
  },
  {
    name: "Burgers",
    category: "burgers",
    icon: <Fastfood />,
  },
  {
    name: "Sandwiches",
    category: "sandwiches",
    icon: <LunchDining />,
  },
  {
    name: "Desserts",
    category: "desserts",
    icon: <Icecream />,
  },
];
