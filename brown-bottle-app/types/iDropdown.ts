
export interface DropdownOption<T extends number | string | null> {
    key: string;
    value: T;
}

export const yesNoDropdownOptions: DropdownOption<number>[] = [
  { value: 1, key: "Yes" },
  { value: 0, key: "No" },
];

export const yesOption: DropdownOption<number> = { value: 1, key: "Yes" };
export const noOption: DropdownOption<number> = { value: 0, key: "No" };

