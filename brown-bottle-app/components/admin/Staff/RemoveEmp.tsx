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

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Employee[]>([]);

    const [localRefresh, setLocalRefresh] = useState(0);
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);

    const { confirm } = useConfirm();

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

    const handleRemove = async () => {

        if (selectedIds.size == 0) {
            alert("You must select at least one employee to remove!")
            return;
        }

        // Confirmation Popup
        const ok = await confirm(
            "Confirm Deletion",
            `Are you sure you want to delete ${selectedIds.size} selected employee(s)?`
        );

        if (!ok) return;

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



    return (

        <View style={styles.container}>


            {/* Clickable Tile */}
            <TouchableOpacity onPress={onOpen} style={styles.removeButton}>
                <Ionicons name="person-remove" size={30} color="black" style={styles.icon} />
                <Text style={[GlobalStyles.boldText, styles.iconText]}>Remove Employee</Text>
            </TouchableOpacity>


            {/* Remove Emp Modal */}
            <ModularModal visible={modalVisible} onClose={onClose} scroll={false}>

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

                {loading && <LoadingCircle size="small" style={{ marginTop: 10, alignSelf: 'center' }} />}

                {/* Search Results (Scrollable) */}
                <View style={{ height: HEIGHT * 0.42 }}>
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
                <View style={GlobalStyles.buttonRowContainer}>
                    <ModularButton
                        text="Delete"
                        textStyle={{ color: 'white' }}
                        style={[GlobalStyles.submitButton, { flex: 1 }]}
                        onPress={handleRemove}
                        enabled={!loading}
                    />
                    <ModularButton
                        text="Cancel"
                        textStyle={{ color: 'gray' }}
                        style={[GlobalStyles.cancelButton, { flex: 1 }]}
                        onPress={onClose}
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
});

export default RemoveEmp;
