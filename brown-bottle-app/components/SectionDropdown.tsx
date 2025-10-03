import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { Colors } from '@/constants/Colors'; 
import { GlobalStyles } from "@/constants/GlobalStyles";

import { getAllSections } from "@/utils/api/section";

import { Section } from '@/types/api'

interface SectionDropdownProps {
  selectedSectionId: number;
  onSectionSelect: (sectionId: number, sectionName: string) => void;
  labelText?: string; // Optional Prop

  // Optional: If parent passes sections, use them instead of fetching
  sections?: Section[];

  // Option to disable internal fetching (default true)
  fetchSections?: boolean;
}

const SectionDropdown: React.FC<SectionDropdownProps> = ({
  selectedSectionId,
  onSectionSelect,
  labelText = "Filter:",
  sections: parentSections,
  fetchSections = true,
}) => {
  const [sections, setSections] = useState<Section[]>(parentSections ?? []);
  const [loading, setLoading] = useState<boolean>(fetchSections && !parentSections);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If parent passed sections, just set them
    if (parentSections && parentSections.length > 0) {
      setSections(parentSections);
      setLoading(false);
      return; // Skip fetch
    }

    if (!fetchSections) {
      // Disabled fetch and no sections passed -> empty list
      setSections([]);
      setLoading(false);
      return;
    }

    // Fetch sections internally if allowed and no parent data
    const fetchData = async () => {
      try {
        const data = await getAllSections();
        setSections(data);

        // Notify parent of the current selectedSectionId's name after loading
        const currentSection = data.find(
          (section: Section) => section.section_id === selectedSectionId
        );
        if (currentSection) {
          onSectionSelect(currentSection.section_id, currentSection.section_name);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parentSections, fetchSections, selectedSectionId, onSectionSelect]);

  if (loading) {
    return <Text style={GlobalStyles.loadingText}>Loading sections...</Text>;
  }

  if (error) {
    return <Text style={GlobalStyles.errorText}>Unable to fetch sections!</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelText}</Text>

      <Picker
        selectedValue={selectedSectionId}
        onValueChange={(value: string | number) => {
          const sectionId = Number(value);

          if (sectionId !== selectedSectionId) {
            const selectedSection = sections.find(
              (section) => section.section_id === sectionId
            );
            if (selectedSection) {
              onSectionSelect(selectedSection.section_id, selectedSection.section_name);
            }
          }
        }}
        style={styles.picker}
      >
        {sections.map((section) => (
          <Picker.Item
            key={section.section_id}
            label={section.section_name}
            value={section.section_id}
            color='black'
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  label: {
    fontSize: 16,
    marginRight: 5,
  },
  picker: {
    flexGrow: 1,
    padding: 5,
    fontSize: 16,
  },
});

export default SectionDropdown;
