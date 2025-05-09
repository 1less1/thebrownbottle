import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from '@/constants/Colors'; 

import { getAllRoles } from "@/utils/api/role";

interface Role {
  role_id: number;
  role_name: string;
}

interface RoleDropdownProps {
    selectedRoleId: number; // valid role id
    onRoleSelect: (roleId: number) => void; // Must accept number 
}

export default function RoleDropdown({ selectedRoleId, onRoleSelect }: RoleDropdownProps) {
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
    return <Text>Loading roles...</Text>;
  }

  return (
    <View>
      <Text style={styles.label}>Filter:</Text>
      <Picker
        selectedValue={selectedRoleId ?? -1}
        onValueChange={(value: number) => onRoleSelect(value)}
        style={styles.picker}
      >
        <Picker.Item label="None..." value={-1} />
        {roles.map((role) => (
          <Picker.Item key={role.role_id} label={role.role_name} value={role.role_id} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
  },
  picker: {
    width: "100%",
    padding: 5,
  },
});
