import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Dimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { debounce } from "lodash";

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import RoleDropdown from '@/components/modular/RoleDropdown';
import ModularDropdown from '@/components/modular/ModularDropdown';
import LoadingCircle from "@/components/modular/LoadingCircle";

import { Employee } from "@/types/api";
import { getEmployee } from "@/utils/api/employee";
import { removeEmployees } from '@/utils/api/employee';


interface RemoveEmpProps {
    onRemove?: () => void;
}

const RemoveEmp: React.FC<RemoveEmpProps> = ({ onRemove }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Employee[]>([]);

    const [localRefresh, setLocalRefresh] = useState(0);
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleConfirmationModal = () => {
        setConfirmationModalVisible(!confirmationModalVisible);
    }

    const onOpen = () => {
        toggleModal();
        triggerRefresh(query);
    }

    const onClose = () => {
        toggleModal();
        setQuery("");
        setResults([]);
        setSelectedIds(new Set());
    };

    const onConfirmationClose = () => {
        toggleConfirmationModal();
    }

    const buildParams = (
        searchTerm: string,
    ) => {
        const wildcardTerm = `%${searchTerm.trim()}%`;
        const params: Record<string, any> = { full_name: wildcardTerm, is_active: 1 };
        return params;
    };


    const fetchEmployees = async (searchTerm: string) => {
        setLoading(true);
        try {
            const response = await getEmployee(buildParams(searchTerm));
            setResults(response);
        } catch (error: any) {
            console.error("Search failed:", error.message);
        } finally {
            setLoading(false);
            onRemove?.(); // Notify parent refresh is complete
        }
    };


    const debouncedSearch = useCallback(debounce(fetchEmployees, 500), []);

    const handleSearchChange = (text: string) => {
        setQuery(text);
        debouncedSearch(text);
    };

    const triggerRefresh = (searchTerm: string) => {
        fetchEmployees(searchTerm);
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


    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const toggleSelection = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleRemoveRequest = () => {
        if (selectedIds.size === 0) {
            alert("You must select at least one employee to remove!");
            return;
        }
        toggleConfirmationModal();
    };

    const handleRemove = async () => {

        if (selectedIds.size == 0) {
            alert("You must select at least one employee to remove!")
            return;
        }

        const employeeIdList = Array.from(selectedIds);

        setLoading(true);

        try {
            await removeEmployees(employeeIdList);
            alert("Employee(s) successfully removed!")
            onRemove?.();
            onConfirmationClose();
            onClose();
        } catch (error: any) {
            alert("Unable to remove Employee(s): " + error.message);
        } finally {
            setLoading(false);
        }

    };


    const renderItem = ({ item }: { item: Employee }) => {
        const isSelected = selectedIds.has(item.employee_id);
        return (
            <View style={styles.listRow}>
                <Text style={GlobalStyles.text}>{item.full_name}</Text>
                <TouchableOpacity
                    onPress={() => toggleSelection(item.employee_id)}
                    style={[styles.checkbox, isSelected && styles.checkboxSelected]}
                >
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
            </View>
        );
    };


    return (

        <View style={styles.container}>


            {/* Clickable Content */}
            <TouchableOpacity onPress={onOpen} style={styles.removeButton}>
                <Ionicons name="person-remove" size={30} color="black" style={styles.icon} />
                <Text style={[GlobalStyles.boldText, styles.iconText]}>Remove Employee</Text>
            </TouchableOpacity>


            {/* Remove Emp Modal */}
            <ModularModal visible={modalVisible} onClose={onClose}>

                {/* Title */}
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
                    <ModularButton onPress={handleReset} text="Reset" />
                </View>

                {loading && <LoadingCircle size="small" style={{ marginTop: 10, alignSelf: 'center' }} />}

                {/* Search Results */}
                <View style={{ height: 200 }}>
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.employee_id?.toString() ?? ""}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={true}
                    />

                    {!loading && results.length === 0 && query.length > 0 && (
                        <Text style={[GlobalStyles.text, { marginBottom: 10, textAlign: "center" }]}>
                            No results found...
                        </Text>
                    )}

                </View>

                {/* Buttons */}
                <View style={styles.buttonRowContainer}>
                    <ModularButton
                        text="Delete"
                        textStyle={{ color: 'white' }}
                        style={GlobalStyles.submitButton}
                        onPress={handleRemoveRequest}
                        enabled={!loading}
                    />
                    <ModularButton
                        text="Cancel"
                        textStyle={{ color: 'gray' }}
                        style={GlobalStyles.cancelButton}
                        onPress={onClose}
                        enabled={!loading}
                    />
                </View>

            </ModularModal>


            { /* Confirmation Modal */}
            <ModularModal visible={confirmationModalVisible} onClose={onConfirmationClose}>

                <Text style={GlobalStyles.modalTitle}>Confirm Deletion</Text>

                <Text style={[GlobalStyles.text, { marginVertical: 10 }]}>
                    Are you sure you want to delete {selectedIds.size} employee{selectedIds.size > 1 ? "s" : ""}?
                </Text>

                {/* Buttons */}
                <View style={styles.buttonRowContainer}>
                    <ModularButton
                        text="Yes"
                        textStyle={{ color: 'white' }}
                        style={GlobalStyles.submitButton}
                        onPress={handleRemove}
                        enabled={!loading}
                    />
                    <ModularButton
                        text="Cancel"
                        textStyle={{ color: 'gray' }}
                        style={GlobalStyles.cancelButton}
                        onPress={onConfirmationClose}
                        enabled={!loading}
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
        height: 150,
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
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: Colors.lightBorderColor,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxSelected: {
        backgroundColor: Colors.blue,
        borderColor: Colors.blue,
    },
    checkmark: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: "bold",
    },
    buttonRowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 20,
    },

});

export default RemoveEmp;
