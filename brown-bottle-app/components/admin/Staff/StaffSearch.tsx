import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, ActivityIndicator, FlatList, ScrollView, StyleSheet } from "react-native";
import { debounce } from "lodash";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import AltCard from "@/components/modular/AltCard";
import RoleDropdown from "@/components/RoleDropdown";
import ModularDropdown from "@/components/modular/ModularDropdown";
import ModularButton from "@/components/modular/ModularButton";

import { Employee } from "@/types/api";
import { getEmployee } from "@/utils/api/employee";


const adminDropdownOptions = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
];

const columns = [
    { key: "full_name", label: "Name", flex: 2 },
    { key: "email", label: "Email", flex: 3.75 },
    { key: "phone_number", label: "Phone", flex: 2.25 },
    { key: "primary_role_name", label: "Primary", flex: 2 },
];

const StaffSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedRoleId, setSelectedRoleId] = useState<number>(-1);
    const [selectedAdminOption, setSelectedAdminOption] = useState<number>(-1);


    const buildParams = (searchTerm: string) => {
        const wildcardTerm = `%${searchTerm.trim()}%`;
        const params: Record<string, any> = { full_name: wildcardTerm };

        if (selectedRoleId !== -1) {
            params.primary_role = selectedRoleId;
            params.secondary_role = selectedRoleId;
            params.tertiary_role = selectedRoleId;
        }

        if (selectedAdminOption !== -1) {
            params.admin = selectedAdminOption;
        }

        return params;
    };


    const fetchEmployees = async (searchTerm: string) => {
        setLoading(true);
        try {
            const response = await getEmployee(buildParams(searchTerm));
            setResults(response);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce(fetchEmployees, 500), []);

    const handleSearchChange = (text: string) => {
        setQuery(text);
        debouncedSearch(text);
    };

    const handleReset = () => {
        setQuery("");
        setSelectedRoleId(-1);
        setSelectedAdminOption(-1);
        fetchEmployees("");
    };

    // Fetch Employees on Initialization
    useEffect(() => {
        fetchEmployees(query);
    }, [selectedRoleId, selectedAdminOption]);


    const renderHeader = useCallback(() => (
        <View style={styles.row}>
            {columns.map((col) => (
                <View key={col.key} style={[styles.cell, { backgroundColor: Colors.lightBorderColor, flex: col.flex }]}>   
                    <Text style={GlobalStyles.boldText}>{col.label}</Text>
                </View>
            ))}
        </View>
    ), [columns]);


    const renderItem = useCallback(({ item }: { item: Employee }) => (
        <View style={styles.row}>
            {columns.map((col) => (
                <View key={col.key} style={[styles.cell, { flex: col.flex }]}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={GlobalStyles.text}>
                        {item[col.key as keyof Employee]?.toString() ?? ""}
                    </Text>
                </View>
            ))}
        </View>
    ), [columns]);


    return (

        <AltCard style={{ backgroundColor: Colors.white, height: 350 }}>

            {/* Search Bar + Reset Button */}
            <View style={styles.searchContainer}>
                <TextInput
                    value={query}
                    onChangeText={handleSearchChange}
                    placeholder="Search Staff by Name"
                    style={styles.input}
                />
                <ModularButton onPress={handleReset} text="Reset" />
            </View>

            {/* Dropdowns */}
            <View style={styles.filterContainer}>
                <RoleDropdown selectedRoleId={selectedRoleId} onRoleSelect={setSelectedRoleId} labelText="" />
                <ModularDropdown
                    selectedValue={selectedAdminOption}
                    onSelect={(value) => setSelectedAdminOption(Number(value))}
                    options={adminDropdownOptions}
                    labelText=""
                    placeholder="Select Admin..."
                />
            </View>

            {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

            {/* Data Table */}
            {/* Vertical Scroll */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                {/* Horizontal Scroll */}
                <ScrollView horizontal style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.tableContainer}>
                        {renderHeader()}
                        <FlatList
                            data={results}
                            keyExtractor={(item, index) => item.employee_id?.toString() ?? `fallback-${index}`}
                            renderItem={renderItem}
                            scrollEnabled={false}
                        />
                    </View>
                </ScrollView>
            </ScrollView>

            {/* Fallback */}
            {!loading && results.length === 0 && query.length > 0 && (
                <Text style={[GlobalStyles.text, { marginVertical: 10, textAlign: "center" }]}>
                    No staff found...
                </Text>
            )}

        </AltCard>

    );
};


const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 12,
    },
    filterContainer: {
        flexDirection: "row",
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
    row: {
        flexDirection: "row",
        borderColor: Colors.lightBorderColor,
    },
    cell: {
        padding: 8,
        borderWidth: 1,
        borderColor: Colors.lightBorderColor,
    },
    tableContainer: {
        flex: 1,
        width: "100%",
        alignSelf: "stretch",
    },
    headerText: {
        fontWeight: "bold",
        textAlign: "left",
    },
});


export default StaffSearch;
