import React, { useState, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

import ModularCheckbox from "@/components/modular/checkbox/ModularCheckbox";
import { CheckboxOption } from "@/types/iCheckbox";
import { getSection } from "@/routes/section";
import { Section } from "@/types/iSection";

interface SectionCheckboxProps {
    selectedSections: CheckboxOption<number>[];
    onSectionSelect: (keys: string[], values: number[]) => void;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}

const SectionCheckbox: React.FC<SectionCheckboxProps> = ({
    selectedSections,
    onSectionSelect,
    containerStyle,
    buttonStyle,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [sectionData, setSectionData] = useState<CheckboxOption<number>[]>([]);

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
        <ModularCheckbox
            data={sectionData}
            selectedData={selectedSections}
            onSelect={onSectionSelect}
            singularLabel="Section"
            pluralLabel="Sections"
            disabled={loading}
            containerStyle={containerStyle}
            buttonStyle={buttonStyle}
        />
    );
};

export default SectionCheckbox;
