import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from "@/constants/GlobalStyles";

import { getRole } from "@/utils/api/role";

import { Role } from '@/types/api';

interface RoleDropdownProps {
  selectedRoleId: number;
  onRoleSelect: (roleId: number, roleName: string) => void;
  labelText?: string; // Optional Prop

  // Optional: If parent passes roles, use them instead of fetching
  roles?: Role[];

  // Option to disable internal fetching (default true)
  fetchRoles?: boolean;
  containerStyle?: object; // optional custom container styles
  pickerStyle?: object;    // optional custom picker styles
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({
  selectedRoleId,
  onRoleSelect,
  labelText = "Filter:",
  roles: parentRoles,
  fetchRoles = true,
  containerStyle,
  pickerStyle,
}) => {
  const [roles, setRoles] = useState<Role[]>(parentRoles ?? []);
  const [loading, setLoading] = useState<boolean>(fetchRoles && !parentRoles);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If parent passed roles, just set them
    if (parentRoles && parentRoles.length > 0) {
      setRoles(parentRoles);
      setLoading(false);
      return; // Skip fetch
    }

    if (!fetchRoles) {
      // Disabled fetch and no roles passed -> empty list
      setRoles([]);
      setLoading(false);
      return;
    }

    // Fetch roles internally if allowed and no parent data
    const fetchData = async () => {
      try {
        const data = await getRole();
        setRoles(data);

        // Notify parent of the current selectedRoleId's name after loading
        const currentRole = data.find(
          (role: Role) => role.role_id === selectedRoleId
        );
        if (currentRole) {
          onRoleSelect(currentRole.role_id, currentRole.role_name);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parentRoles, fetchRoles, selectedRoleId, onRoleSelect]);

  if (loading) {
    return <Text style={GlobalStyles.loadingText}>Loading roles...</Text>;
  }

  if (error) {
    return <Text style={GlobalStyles.loadingText}>Unable to fetch roles!</Text>;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{labelText}</Text>

      <Picker
        selectedValue={selectedRoleId}
        onValueChange={(value: string | number) => {
          const roleId = Number(value);

          if (roleId === -1) {
            onRoleSelect(-1, ""); // or "Select a role..." if you want to show that
            return;
          }

          if (roleId !== selectedRoleId) {
            const selectedRole = roles.find(
              (role) => role.role_id === roleId
            );
            if (selectedRole) {
              onRoleSelect(selectedRole.role_id, selectedRole.role_name);
            }
          }
        }}
        style={[styles.picker, pickerStyle]}
      >
        <Picker.Item label="Select a role..." value={-1} color="black"/>
        {roles.map((role) => (
          <Picker.Item
            key={role.role_id}
            label={role.role_name}
            value={role.role_id}
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

export default RoleDropdown;
