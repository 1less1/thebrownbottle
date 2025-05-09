import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from '@/constants/Colors'; 

import { getAllSections } from "@/utils/api/section";

import { Section } from '@/types/api'


interface SectionDropdownProps {
    selectedRoleId: number;
    onRoleSelect: (roleId: number) => void; 
    labelText?: string; // Optional Prop
}

const SectionDropdown: React.FC<SectionDropdownProps> = ({ selectedRoleId, onRoleSelect, labelText = "Filter:" }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getAllSections();
        setSections(data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) {
    return <Text style={styles.altText}>Loading sections...</Text>;
  }

  return (

    <View style={styles.container}>

      <Text style={styles.label}>{labelText}</Text>
      <Picker
          onValueChange={(value: number) => onRoleSelect(value)}
          style={styles.picker}
          >
          {sections.map((section) => (
          <Picker.Item key={section.section_id} label={section.section_name} value={section.section_id} />
          ))}
      </Picker>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center'
  },
  label: {
      fontSize: 16,
      marginRight: 5,
  },
  picker: {
      flexGrow: 1,
      padding: 5,
  },
  altText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.gray,
  },
});

export default SectionDropdown;
