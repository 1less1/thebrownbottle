import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ActivityIndicator, FlatList, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { debounce } from "lodash";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import AltCard from "@/components/modular/AltCard";

import RoleDropdown from "@/components/modular/RoleDropdown";
import ModularDropdown from "@/components/modular/ModularDropdown";

import ModularButton from "@/components/modular/ModularButton";
import LoadingCircle from "@/components/modular/LoadingCircle";

import EditEmp from "@/components/admin/Staff/EditEmp";

import { Employee } from "@/types/iApi";
import { getEmployee } from "@/utils/api/employee";



const adminDropdownOptions = [
    { value: 1, key: "Yes" },
    { value: 0, key: "No" },
];

const isActiveDropdownOptions = [
    { value: 1, key: "Yes" },
    { value: 0, key: "No" },
]

const columns = [
    { key: "full_name", label: "Name", width: 120 },
    { key: "email", label: "Email", width: 200 },
    { key: "phone_number", label: "Phone", width: 140 },
    { key: "primary_role_name", label: "Primary", width: 120 },
];

interface StaffSearchProps {
    parentRefresh?: number;
    onRefreshDone?: () => void;
}


const StaffSearch: React.FC<StaffSearchProps> = ({ parentRefresh, onRefreshDone }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Employee[]>([]);

    const [localRefresh, setLocalRefresh] = useState(0);
    const [loading, setLoading] = useState(false);

    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [selectedAdminOption, setSelectedAdminOption] = useState<number | null>(null);
    const [selectedIsActiveOption, setSelectedIsActiveOption] = useState<number>(1); // Default value is_active=1 (True)


    const buildParams = (
        searchTerm: string,
        isActive: number | null,
        roleId: number | null,
        admin: number | null
    ) => {
        const wildcardTerm = `%${searchTerm.trim()}%`;
        const params: Record<string, any> = { full_name: wildcardTerm };

        if (isActive !== null) {
            params.is_active = isActive;
        }
        if (roleId !== null) {
            params.primary_role = roleId;
            params.secondary_role = roleId;
            params.tertiary_role = roleId;
        }

        if (admin !== null) {
            params.admin = admin;
        }

        return params;
    };


    const fetchEmployees = async (
        searchTerm: string,
        isActive: number | null,
        roleId: number | null,
        admin: number | null
    ) => {
        setLoading(true);
        try {
            const response = await getEmployee(buildParams(searchTerm, isActive, roleId, admin));
            setResults(response);
        } catch (error: any) {
            console.error("Search failed:", error.message);
        } finally {
            setLoading(false);
            onRefreshDone?.(); // Notify parent refresh is complete
        }
    };


    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            fetchEmployees(searchTerm, selectedIsActiveOption, selectedRoleId, selectedAdminOption);
        }, 500),
        [selectedIsActiveOption, selectedRoleId, selectedAdminOption]
    );


    const handleSearchChange = (searchTerm: string) => {
        setQuery(searchTerm);
        debouncedSearch(searchTerm);
    };

    const triggerRefresh = (searchTerm: string) => {
        fetchEmployees(searchTerm, selectedIsActiveOption, selectedRoleId, selectedAdminOption);
    };

    const handleReset = () => {
        if (query !== "" || selectedRoleId !== null || selectedAdminOption !== null || selectedIsActiveOption !== 1) {
            debouncedSearch.cancel();
            setQuery("");
            setSelectedRoleId(null);
            setSelectedAdminOption(null);
            setSelectedIsActiveOption(1);
            setLocalRefresh((prev) => prev + 1); // triggers refresh
        }
    };


    // Fetch Employees on Initialization and State Update
    useEffect(() => {
        triggerRefresh(query);
    }, [selectedRoleId, selectedAdminOption, selectedIsActiveOption, parentRefresh, localRefresh]);


    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [editEmpVisible, setEditEmpVisible] = useState(false);

    const closeEditEmp = () => {
        setEditEmpVisible(!editEmpVisible);
        setSelectedEmployee(null);
    }


    const renderHeader = useCallback(() => (
        <View style={styles.row}>
            {columns.map((col) => (
                <View key={col.key} style={[styles.cell, { flex: 1, width: col.width, backgroundColor: Colors.lightBorderColor }]}>
                    <Text style={GlobalStyles.boldText}>{col.label}</Text>
                </View>
            ))}
        </View>
    ), []);

    const renderCell = useCallback(({ item }: { item: Employee }) => (
        <View style={styles.row}>
            {columns.map((col) => {
                const cellContent = item[col.key as keyof Employee]?.toString() ?? "";

                const isNameColumn = col.key === "full_name";

                return (
                    <View key={col.key} style={[styles.cell, { flex: 1, width: col.width }]}>
                        {isNameColumn ? (
                            <TouchableOpacity onPress={() => {
                                setSelectedEmployee(item);
                                setEditEmpVisible(true);
                            }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[GlobalStyles.text, { color: Colors.blue, textDecorationLine: 'underline' }]}>
                                    {cellContent}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text numberOfLines={1} ellipsizeMode="tail" style={GlobalStyles.text}>
                                {cellContent}
                            </Text>
                        )}
                    </View>
                );
            })}
        </View>
    ), []);


    return (

        <>

            <Card style={{ backgroundColor: Colors.white, paddingVertical: 6, height: 500 }}>

                {/* Search Bar + Reset Button */}
                <View style={styles.searchContainer}>
                    <TextInput
                        value={query}
                        onChangeText={handleSearchChange}
                        placeholder="Search Staff by Name"
                        placeholderTextColor={Colors.gray}
                        style={styles.input}
                    />
                    <ModularButton onPress={handleReset} text="Reset" />
                </View>

                {/* Dropdowns */}
                <View style={styles.filterContainer}>
                    <RoleDropdown
                        selectedRoleId={selectedRoleId}
                        onRoleSelect={(value) => setSelectedRoleId(value)}
                        labelText=""
                        containerStyle={styles.dropdownButton}
                        editable={!loading}
                    />
                    <ModularDropdown
                        selectedValue={selectedAdminOption}
                        // Declare value being selected is a number
                        onSelect={(value) => setSelectedAdminOption(value as number)}
                        labelText=""
                        containerStyle={styles.dropdownButton}
                        placeholder="Select admin..."
                        options={adminDropdownOptions}
                        editable={!loading}
                    />
                    <ModularDropdown
                        selectedValue={selectedIsActiveOption}
                        // Declare value being selected is a number
                        onSelect={(value) => setSelectedIsActiveOption(value as number)}
                        labelText="Active:"
                        containerStyle={styles.dropdownButton}
                        options={isActiveDropdownOptions}
                        usePlaceholder={false}
                        editable={!loading}
                    />
                </View>

                {loading && <LoadingCircle size="small" style={{ marginTop: 10, alignSelf: 'center' }} />}

                {/* Data Table */}
                {/* Horizontal Scroll only */}
                <View style={{ flex: 1 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.tableContainer}>
                            {renderHeader()}
                            <FlatList
                                data={results}
                                keyExtractor={(item, index) => item.employee_id?.toString() ?? `fallback-${index}`}
                                renderItem={renderCell}
                                style={{ maxHeight: 350 }}
                                scrollEnabled={true}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                            />
                        </View>
                    </ScrollView>
                </View>

                {/* Fallback */}
                {!loading && results.length === 0 && query.length > 0 && (
                    <Text style={[GlobalStyles.text, { marginBottom: 10, textAlign: "center" }]}>
                        No results found...
                    </Text>
                )}

            </Card>

            <EditEmp
                visible={editEmpVisible}
                onClose={closeEditEmp}
                empData={selectedEmployee as Employee}
                onUpdate={() => setLocalRefresh((prev) => prev + 1)}
            />


        </>

    );
};


const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        paddingVertical: 6,
        gap: 6,
        marginBottom: 12,
    },
    filterContainer: {
        flexDirection: "row",
        flexWrap: "wrap", // allows wrapping on small screens
        justifyContent: "flex-start",
        gap: 12,
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        flexGrow: 1,
        padding: 8,
        borderRadius: 4,
    },
    dropdownButton: {
        minWidth: 0,      // let it shrink as much as content allows
        alignSelf: "flex-start", // size to content rather than container
    },
    row: {
        flexDirection: "row",
        borderColor: Colors.lightBorderColor,
    },
    cell: {
        padding: 8,
        borderWidth: 1,
        borderColor: Colors.lightBorderColor,
        flexShrink: 1,
    },
    tableContainer: {
        flex: 1,
        maxWidth: "100%",
        alignSelf: "stretch",
    },
    headerText: {
        fontWeight: "bold",
        textAlign: "left",
    },
});


export default StaffSearch;
