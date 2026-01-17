import React, { useState, useEffect, useCallback } from 'react';
import { useWindowDimensions, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { debounce } from "lodash";

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import LoadingCircle from "@/components/modular/LoadingCircle";

import { Employee } from "@/types/iEmployee";
import { getEmployee } from "@/routes/employee";
import { removeEmployees } from '@/routes/employee';

import { useConfirm } from '@/hooks/useConfirm';


interface RemoveEmpProps {
    onRemove?: () => void;
}

const RemoveEmp: React.FC<RemoveEmpProps> = ({ onRemove }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const { confirm } = useConfirm();

    const [localRefresh, setLocalRefresh] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Employee[]>([]);

    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => {
        setModalVisible(true);
        triggerRefresh(query);
    }
    const closeModal = () => {
        setModalVisible(false);
        setQuery("");
        setResults([]);
        setSelectedIds(new Set());
    };

    // Fetch Employee Logic
    const fetchEmployees = async (searchTerm: string) => {
        try {
            setError(null);
            setLoading(true);

            const params: Record<string, any> = {
                full_name: searchTerm.trim() ? `%${searchTerm.trim()}%` : undefined,
                is_active: 1,
            };

            const response = await getEmployee(params);
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
        }, 500), []
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
        if (selectedIds.size !== 0) {
            setSelectedIds(new Set());
        }
        if (query !== "") {
            debouncedSearch.cancel();
            setQuery("");
            setLocalRefresh((prev) => prev + 1); // triggers refresh
        }
    };

    // Fetch Employees on Initialization and State Update
    useEffect(() => {
        triggerRefresh(query);
    }, [localRefresh]);

    const toggleSelection = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // Remove Employee Logic
    const handleRemove = async () => {
        if (loading || selectedIds.size === 0) return;

        // Confirmation Popup
        const ok = await confirm(
            "Confirm Deletion",
            `Are you sure you want to delete ${selectedIds.size} selected employee(s)?`
        );
        if (!ok) return;

        try {
            setLoading(true);

            const employeeIdList = Array.from(selectedIds);
            await removeEmployees(employeeIdList);
            alert("Employee(s) successfully removed!")
            onRemove?.();
            closeModal();
        } catch (error: any) {
            alert("Unable to remove employee(s): " + error.message);
            console.log("Unable to remove employee(s): " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Select Employee Logic inside...
    const renderItem = ({ item }: { item: Employee }) => {
        const isSelected = selectedIds.has(item.employee_id);
        return (
            <View style={styles.listRow}>
                <Text style={GlobalStyles.text}>{item.full_name}</Text>
                <TouchableOpacity
                    onPress={() => toggleSelection(item.employee_id)}
                >
                    <Ionicons
                        name={isSelected ? "checkbox-outline" : "square-outline"}
                        size={20}
                        color={isSelected ? Colors.blue : Colors.gray}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const ListEmpty = (
        <View style={styles.singleRow}>
            <Text style={GlobalStyles.text}>No employees found!</Text>
        </View>
    );

    return (

        <View style={styles.container}>


            {/* Clickable Tile */}
            <TouchableOpacity onPress={openModal} style={styles.removeButton}>
                <Ionicons name="person-remove" size={30} color="black" style={styles.icon} />
                <Text style={[GlobalStyles.boldText, styles.iconText]}>Remove Employee</Text>
            </TouchableOpacity>


            {/* Remove Emp Modal */}
            <ModularModal visible={modalVisible} onClose={closeModal} scroll={false}>

                {/* Header */}
                <Text style={GlobalStyles.modalTitle}>Remove Employee</Text>

                {/* Search Bar + Reset Button */}
                <View style={styles.searchContainer}>
                    <TextInput
                        value={query}
                        onChangeText={handleSearchChange}
                        placeholder="Search Staff by Name"
                        placeholderTextColor={Colors.gray}
                        style={styles.input}
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

                {/* Search Results (Scrollable) */}
                <View style={{ height: HEIGHT * 0.42 }}>
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
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={true}
                            ListEmptyComponent={ListEmpty}
                        />
                    )}
                </View>

                {/* Buttons */}
                <View style={GlobalStyles.buttonRowContainer}>
                    <ModularButton
                        text="Remove"
                        textStyle={{ color: Colors.red }}
                        style={[GlobalStyles.borderButton, styles.deleteButton]}
                        onPress={handleRemove}
                        enabled={!loading && selectedIds.size > 0}
                    />
                    <ModularButton
                        text="Cancel"
                        textStyle={{ color: 'gray' }}
                        style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
                        onPress={closeModal}
                    />
                </View>

            </ModularModal>

        </View>

    );

};

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'column',
        padding: 15,
        height: 120,
        justifyContent: 'center',
    },
    icon: {
        marginBottom: 8,
    },
    iconText: {
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    searchContainer: {
        flexDirection: "row",
        paddingVertical: 6,
        gap: 6,
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        flexGrow: 1,
        padding: 8,
        borderRadius: 4,
    },
    listRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: Colors.lightBorderColor,
    },
    singleRow: {
        flex: 1,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    deleteButton: {
        flexGrow: 1,
        backgroundColor: Colors.bgRed,
        borderColor: Colors.borderRed,
        alignItems: "center"
    },
});

export default RemoveEmp;
