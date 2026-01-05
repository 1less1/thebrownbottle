
export interface CheckboxOption<T extends string | number> {
    key: string;
    value: T;
}

export const dayCheckboxOptions: CheckboxOption<string>[] = [
    { key: "Mon", value: "mon" },
    { key: "Tue", value: "tue" },
    { key: "Wed", value: "wed" },
    { key: "Thu", value: "thu" },
    { key: "Fri", value: "fri" },
    { key: "Sat", value: "sat" },
    { key: "Sun", value: "sun" },
];