import React, { useState, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";

import ModularCheckbox from "@/components/modular/checkbox/ModularCheckbox";
import { CheckboxOption } from "@/types/iCheckbox";
import { getRole } from "@/routes/role";
import { Role } from "@/types/iRole";

interface RoleCheckboxProps {
    selectedRoles: CheckboxOption<number>[];
    onRoleSelect: (keys: string[], values: number[]) => void;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}

const RoleCheckbox: React.FC<RoleCheckboxProps> = ({
    selectedRoles,
    onRoleSelect,
    containerStyle,
    buttonStyle,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [roleData, setRoleData] = useState<CheckboxOption<number>[]>([]);

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
        <ModularCheckbox
            data={roleData}
            selectedData={selectedRoles}
            onSelect={onRoleSelect}
            singularLabel="Role"
            pluralLabel="Roles"
            disabled={loading}
            containerStyle={containerStyle}
            buttonStyle={buttonStyle}
        />
    );
};

export default RoleCheckbox;
