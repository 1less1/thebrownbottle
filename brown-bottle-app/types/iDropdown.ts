
export interface DropdownOption<T extends number | string | null> {
  key: string;
  value: T;
}

export type YesNoSortType = 1 | 0;
export type DateSortType = "Newest" | "Oldest";

export const yesNoDropdownOptions: DropdownOption<number>[] = [
  { key: "Yes", value: 1 },
  { key: "No", value: 0 },
];

export const ageDropdownOptions: DropdownOption<string>[] = [
  { key: "Newest", value: "Newest" },
  { key: "Oldest", value: "Oldest" }
]

export const yesOption: DropdownOption<number> = { value: 1, key: "Yes" };
export const noOption: DropdownOption<number> = { value: 0, key: "No" };

