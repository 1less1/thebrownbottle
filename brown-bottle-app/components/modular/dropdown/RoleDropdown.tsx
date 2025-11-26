import React, { useState, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

import ModularDropdown from "@/components/modular/dropdown/ModularDropdown";
import { DropdownOption } from "@/types/iDropdown";
import { getRole } from "@/routes/role";
import { Role } from "@/types/iRole";

interface RoleDropdownProps {
    selectedRole: number | null;
    onRoleSelect: (value: number | null) => void;
    placeholderText?: string;
    usePlaceholder?: boolean;
    labelText?: string;
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({
    selectedRole,
    onRoleSelect,
    placeholderText = "Select a role...",
    usePlaceholder = true,
    labelText,
    disabled,
    containerStyle,
    buttonStyle,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [roleData, setRoleData] = useState<DropdownOption<number>[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response: Role[] = await getRole();
                const mapped = response.map((r) => ({
                    key: r.role_name,
                    value: r.role_id,
                }));
                setRoleData(mapped);
            } catch (err) {
                console.error("Failed to fetch roles:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <ModularDropdown
            data={roleData}
            selectedValue={selectedRole}
            onSelect={onRoleSelect}
            placeholderText={placeholderText}
            usePlaceholder={usePlaceholder}
            labelText={labelText}
            disabled={loading || disabled}
            containerStyle={containerStyle}
            buttonStyle={buttonStyle}
        />
    );
};

export default RoleDropdown;