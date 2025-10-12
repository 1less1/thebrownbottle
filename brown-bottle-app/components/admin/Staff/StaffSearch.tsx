import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, ActivityIndicator, FlatList, ScrollView, StyleSheet } from "react-native";
import { debounce } from "lodash";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import AltCard from "@/components/modular/AltCard";

import RoleDropdown from "@/components/modular/RoleDropdown";
import ModularDropdown from "@/components/modular/ModularDropdown";

import ModularButton from "@/components/modular/ModularButton";
import LoadingCircle from "@/components/modular/LoadingCircle";

import { Employee } from "@/types/api";
import { getEmployee } from "@/utils/api/employee";


const adminDropdownOptions = [
    { value: 1, key: "Yes" },
    { value: 0, key: "No" },
];

const columns = [
    { key: "full_name", label: "Name", width: 120 },
    { key: "email", label: "Email", width: 200 },
    { key: "phone_number", label: "Phone", width: 140 },
    { key: "primary_role_name", label: "Primary", width: 120 },
];

interface StaffSearchProps {
    refreshTrigger?: number;
    onRefreshDone?: () => void;
}


const StaffSearch: React.FC<StaffSearchProps> = ({ refreshTrigger, onRefreshDone }) => {
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
            onRefreshDone?.(); // Notify parent refresh is complete
        }
    };

    const debouncedSearch = useCallback(debounce(fetchEmployees, 500), []);

    const handleSearchChange = (text: string) => {
        setQuery(text);
        debouncedSearch(text);
    };

    const handleReset = () => {
        if (query !== "" || selectedRoleId !== -1 || selectedAdminOption !== -1) {
            setQuery(""); // Set Query to empty
            setSelectedRoleId(-1);
            setSelectedAdminOption(-1);
        }

    };

    // Fetch Employees on Initialization and State Update
    useEffect(() => {
        fetchEmployees(query);
    }, [selectedRoleId, selectedAdminOption, refreshTrigger]);

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
            {columns.map((col) => (
                <View key={col.key} style={[styles.cell, { flex: 1, width: col.width, }]}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={GlobalStyles.text}>
                        {item[col.key as keyof Employee]?.toString() ?? ""}
                    </Text>
                </View>
            ))}
        </View>
    ), []);


    return (

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
                />
                <ModularDropdown
                    selectedValue={selectedAdminOption}
                    // Declare value being selected is a number
                    onSelect={(value) =>setSelectedAdminOption(value as number)}
                    labelText=""
                    containerStyle={styles.dropdownButton}
                    placeholder="Select admin..."
                    placeholderValue={-1}
                    options={adminDropdownOptions}
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
