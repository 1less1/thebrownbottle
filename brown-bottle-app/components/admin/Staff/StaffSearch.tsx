import React, { useState, useEffect, useCallback } from 'react';
import { useWindowDimensions, View, Text, TextInput, FlatList, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { debounce } from "lodash";

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import AltCard from "@/components/modular/AltCard";

import RoleCheckbox from '@/components/modular/checkbox/RoleCheckbox';
import ModularDropdown from '@/components/modular/dropdown/ModularDropdown';

import ModularButton from "@/components/modular/ModularButton";
import LoadingCircle from "@/components/modular/LoadingCircle";

import EditEmp from "@/components/admin/Staff/EditEmp";

import { CheckboxOption } from "@/types/iCheckbox";
import { DropdownOption } from '@/types/iDropdown';
import { yesNoDropdownOptions } from '@/types/iDropdown';

import { Employee, GetEmployee } from "@/types/iEmployee";
import { getEmployee } from "@/routes/employee";



const adminDropdownOptions = yesNoDropdownOptions;

const isActiveDropdownOptions: DropdownOption<number>[] = [
    { key: "Active", value: 1 },
    { key: "Inactive", value: 0 }
];

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


const StaffSearch: React.FC<StaffSearchProps> = ({ parentRefresh }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const [localRefresh, setLocalRefresh] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Employee[]>([]);

    const [selectedRoles, setSelectedRoles] = useState<CheckboxOption<number>[]>([]); // Default to Empty Array
    const [selectedIsAdmin, setSelectedIsAdmin] = useState<number | null>(null); // Default to null ("placeholderText")
    const [selectedIsActive, setSelectedIsActive] = useState<number>(1); // Default is_active=1 ("Yes")

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const [editEmpVisible, setEditEmpVisible] = useState(false);
    const openEditEmp = (employee: Employee) => {
        setSelectedEmployee(employee);
        setEditEmpVisible(true);
    };
    const closeEditEmp = () => {
        setEditEmpVisible(false);
        setSelectedEmployee(null);
    }

    // Fetch Employee Logic
    const fetchEmployees = async (searchTerm: string,) => {
        try {
            setError(null);
            setLoading(true);

            const roleIds = selectedRoles.map(s => s.value); // Create array of roleIds --> [1, 2, 3]

            const params = {
                full_name: searchTerm.trim() ? `%${searchTerm.trim()}%` : undefined,
                is_active: selectedIsActive,
                role_id: roleIds.length > 0 ? roleIds : undefined,
                admin: selectedIsAdmin,
            };

            const response = await getEmployee(params as GetEmployee);
            setResults(response);
        } catch (error: any) {
            setError("Failed to fetch employee data: " + error.message);
            console.error("Failed to fetch employee data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            fetchEmployees(searchTerm);
        }, 500),
        [selectedIsActive, selectedRoles, selectedIsAdmin]
    );

    const handleSearchChange = (searchTerm: string) => {
        setQuery(searchTerm);
        debouncedSearch(searchTerm);
    };

    const triggerRefresh = (searchTerm: string) => {
        setQuery(searchTerm);
        debouncedSearch.cancel();
        debouncedSearch(searchTerm);
    };

    const handleReset = () => {
        if (query !== "" || selectedRoles.length > 0 || selectedIsAdmin !== null || selectedIsActive !== 1) {
            debouncedSearch.cancel();
            setQuery("");
            setSelectedRoles([]);
            setSelectedIsAdmin(null);
            setSelectedIsActive(1);
            setLocalRefresh((prev) => prev + 1); // triggers refresh
        }
    };

    // Fetch Employees on Initialization and State Update
    useEffect(() => {
        triggerRefresh(query);
    }, [parentRefresh, localRefresh, selectedRoles, selectedIsAdmin, selectedIsActive]);

    
    const renderHeader = useCallback(() => (
        <View style={styles.row}>
            {columns.map((col) => (
                <View key={col.key} style={[styles.cell, { flex: 1, width: col.width, backgroundColor: Colors.lightBorderColor }]}>
                    <Text style={GlobalStyles.boldText}>{col.label}</Text>
                </View>
            ))}
        </View>
    ), []);


    // Select Employee Logic inside...
    const renderCell = useCallback(({ item }: { item: Employee }) => (
        <View style={styles.row}>
            {columns.map((col) => {
                const cellContent = item[col.key as keyof Employee]?.toString() ?? "";

                const isNameColumn = col.key === "full_name";

                return (
                    <View key={col.key} style={[styles.cell, { flex: 1, width: col.width }]}>
                        {isNameColumn ? (
                            <TouchableOpacity onPress={() => openEditEmp(item)}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={GlobalStyles.linkText}>
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


    const ListEmpty = (
        <View style={styles.singleRow}>
            <Text style={GlobalStyles.text}>No employees found!</Text>
        </View>
    );

    return (

        <Card style={{ backgroundColor: Colors.white, paddingVertical: 6, height: HEIGHT * 0.52 }}>

            {/* Search Bar + Reset Button */}
            <View style={styles.searchContainer}>
                <TextInput
                    value={query}
                    onChangeText={handleSearchChange}
                    placeholder="Search Staff by Name"
                    placeholderTextColor={Colors.gray}
                    style={GlobalStyles.searchInput}
                />
                <ModularButton
                    onPress={handleReset}
                    onLongPress={() => Alert.alert("Hint", "Reset Search and All Filters")}
                    text=""
                    enabled={!loading}
                    textStyle={{ marginRight: 4 }}
                >
                    <Ionicons name="reload-outline" size={20} color={Colors.black} style={{ transform: [{ scaleX: -1 }] }} />
                </ModularButton>
            </View>

            {/* Dropdowns */}
            <View style={styles.filterContainer}>
                <RoleCheckbox
                    selectedRoles={selectedRoles}
                    onRoleSelect={(keys, values) => {
                        setSelectedRoles(values.map((value, index) => ({
                            key: keys[index],
                            value: value,
                        })));
                    }}
                    containerStyle={styles.dropdownButton}
                />
                <ModularDropdown
                    data={adminDropdownOptions}
                    selectedValue={selectedIsAdmin}
                    onSelect={(value) => setSelectedIsAdmin(value as number)}
                    containerStyle={styles.dropdownButton}
                    placeholderText={"Select admin..."}
                    disabled={loading}
                />
                <ModularDropdown
                    data={isActiveDropdownOptions}
                    selectedValue={selectedIsActive}
                    onSelect={(value) => setSelectedIsActive(value as number)}
                    containerStyle={styles.dropdownButton}
                    usePlaceholder={false}
                    disabled={loading}
                />
            </View>

            {/* Data Table */}
            {/* Scroll View = Horizontal */}
            {/* Flat List = Vertical */}
            <View style={{ flex: 1 }}>
                <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.tableContainer}>
                        {renderHeader()}

                        {loading ? (
                            // Loading state
                            <View style={styles.singleRow}>
                                <LoadingCircle size="small" />
                            </View>
                        ) : error ? (
                            // Error state
                            <View style={styles.singleRow}>
                                <Text style={GlobalStyles.errorText}>
                                    {error}
                                </Text>
                            </View>
                        ) : (
                            // Success state
                            <FlatList
                                data={results}
                                keyExtractor={(item) => item.employee_id?.toString() ?? ""}
                                renderItem={renderCell}
                                scrollEnabled={true}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                ListEmptyComponent={ListEmpty}
                            />
                        )}

                    </View>
                </ScrollView>
            </View>

            {/* Edit Employee Modal - Update */}
            {selectedEmployee && (
                <EditEmp
                    visible={editEmpVisible}
                    onClose={closeEditEmp}
                    empData={selectedEmployee as Employee}
                    onUpdate={() => setLocalRefresh((prev) => prev + 1)}
                />
            )}

        </Card>

    );

};


const styles = StyleSheet.create({
    // Search and Filter Containers
    searchContainer: {
        flexDirection: "row",
        paddingVertical: 10,
        gap: 6,
        marginBottom: 8,
    },
    filterContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: 12,
        marginBottom: 12,
    },
    dropdownButton: {
        flex: 1,
        flexShrink: 1,
        minWidth: 150,
    },

    // Table
    tableContainer: {
        flex: 1,
        maxWidth: "100%",
        alignSelf: "stretch",
    },
    row: {
        flexDirection: "row",
        borderColor: Colors.lightBorderColor,
    },
    cell: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: Colors.lightBorderColor,
        flexShrink: 1,
    },
    singleRow: {
        flex: 1,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
});


export default StaffSearch;
