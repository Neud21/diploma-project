// export enum FilterCategory {
//   ALL = "All",
//   ASIAN = "Asian",
//   ITALIAN = "Italian",
//   RUSSIAN = "Russian",
//   GREEK = "Greek",
//   BELARUSIAN = "Belarusian",
//   HUNGARIAN = "Hungarian",
//   AMERICAN = "American",
// }

// export const

export const RESTAURANT_CATEGORIES = {
  ASIAN: { label: "Asian", value: "ASIAN" },
  ITALIAN: { label: "Italian", value: "ITALIAN" },
  RUSSIAN: { label: "Russian", value: "RUSSIAN" },
  GREEK: { label: "Greek", value: "GREEK" },
  BELARUSIAN: { label: "Belarusian", value: "BELARUSIAN" },
  HUNGERIAN: { label: "Hungarian", value: "HUNGERIAN" },
  AMERICAN: { label: "American", value: "AMERICAN" },
} as const;

export const FILTER_CATEGORIES = {
  ALL: { label: "All", value: "ALL" },
  ...RESTAURANT_CATEGORIES,
} as const;

export type FilterCategories = keyof typeof FILTER_CATEGORIES;

// export const RESTAURANT_CATEGORIES = [
//   // "Angolan",
//   // "Arab",
//   // "Argentine",
//   // "Australian",
//   // "German",
//   // "Austrian",
//   // "Belgian",
//   // "Bosnian",
//   // "Brazilian",
//   // "Cambodian",
//   // "Canadian",
//   // "Chilean",
//   // "Chinese",
//   // "Japanese",
//   // "Colombian",
//   // "Congolese",
//   // "Croatian",
//   // "Czech",
//   // "Dutch",
//   // "Egyptian",
//   // "Ethiopian",
//   // "Filipino",
//   // "Finnish",
//   // "French",
//   // "Indian",
//   // "Indonesian",
//   // "Irish",
//   // "Israeli",
//   // "Jamaican",
//   // "Kazakh",
//   // "Kenyan",
//   // "Korean",
//   // "Malagasy",
//   // "Malaysian",
//   // "Mexican",
//   // "Mongolian",
//   // "Nigerian",
//   // "Norwegian",
//   // "Pacific",
//   // "Pakistani",
//   // "Peruvian",
//   // "Polish",
//   // "Portuguese",
//   // "Misc",
// ] as const;

export type RestaurantCategory = keyof typeof RESTAURANT_CATEGORIES;

export const ITEM_CATEGORIES = [
  "MAIN",
  "APPETIZER",
  "DESSERT",
  "BEVERAGE",
  "SIDE",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];
