import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from '@/constants/Colors'; 

import { getAllRoles } from "@/utils/api/role";
import { Role } from '@/types/api'


interface RoleDropdownProps {
    selectedRoleId: number;
    onRoleSelect: (roleId: number) => void; 
    labelText?: string; // Optional Prop
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ selectedRoleId, onRoleSelect, labelText = "Filter:" }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading roles...</Text>;
  }

  return (

    <View style={styles.container}>
      
      <Text style={styles.label}>{labelText}</Text>
      
        <Picker
          selectedValue={selectedRoleId}
          onValueChange={(value: number) => {
            if (value !== selectedRoleId) {
              onRoleSelect(value);
            }
          }}
          style={styles.picker}
        >
          {roles.map((role) => (
            <Picker.Item key={role.role_id} label={role.role_name} value={role.role_id} />
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
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.gray,
    alignSelf: 'center',
  },
});

export default RoleDropdown;