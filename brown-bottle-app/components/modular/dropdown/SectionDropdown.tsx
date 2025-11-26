import React, { useState, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

import ModularDropdown from "@/components/modular/dropdown/ModularDropdown";
import { DropdownOption } from "@/types/iDropdown";
import { getSection } from "@/routes/section";
import { Section } from "@/types/iSection";

interface SectionDropdownProps {
    selectedSection: number | null;
    onSectionSelect: (value: number | null) => void;
    placeholderText?: string;
    usePlaceholder?: boolean;
    labelText?: string;
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}

const SectionDropdown: React.FC<SectionDropdownProps> = ({
    selectedSection,
    onSectionSelect,
    placeholderText = "Select a section...",
    usePlaceholder = true,
    labelText,
    disabled,
    containerStyle,
    buttonStyle,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [sectionData, setSectionData] = useState<DropdownOption<number>[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response: Section[] = await getSection();
                const mapped = response.map((s) => ({
                    key: s.section_name,
                    value: s.section_id,
                }));
                setSectionData(mapped);
            } catch (err) {
                console.error("Failed to fetch sections:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <ModularDropdown
            data={sectionData}
            selectedValue={selectedSection}
            onSelect={onSectionSelect}
            placeholderText={placeholderText}
            usePlaceholder={usePlaceholder}
            labelText={labelText}
            disabled={loading || disabled}
            containerStyle={containerStyle}
            buttonStyle={buttonStyle}
        />
    );
};

export default SectionDropdown;