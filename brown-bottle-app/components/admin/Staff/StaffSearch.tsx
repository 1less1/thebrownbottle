import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, ActivityIndicator, FlatList, ScrollView, StyleSheet } from "react-native";
import { debounce } from "lodash";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import AltCard from "@/components/modular/AltCard";

import { Employee } from "@/types/api";
import { getEmployee } from "@/utils/api/employee";

const columns = [
    { key: "full_name", label: "Name", flex: 2 },
    { key: "email", label: "Email", flex: 3.75 },
    { key: "phone_number", label: "Phone", flex: 2.25 },
    { key: "primary_role_name", label: "Primary", flex: 2 },
];

const renderHeader = () => (
    <View style={styles.row}>
        {columns.map((col) => (
            <View key={col.key} style={[styles.cell, { backgroundColor: Colors.lightBorderColor, flex: col.flex ?? 1 }]}>
                <Text style={GlobalStyles.boldText}>{col.label}</Text>
            </View>
        ))}
    </View>
);

const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.row}>
        {columns.map((col) => (
            <View key={col.key} style={[styles.cell, { flex: col.flex ?? 1 }]}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={GlobalStyles.text}>{item[col.key as keyof Employee]?.toString() ?? ""}</Text>
            </View>
        ))}
    </View>
);





export default function StaffSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (text: string) => {
        setQuery(text);
        debouncedSearch(text);
    };

    useEffect(() => {
        fetchEmployees(""); // blank search term on mount
    }, []);


    const fetchEmployees = async (searchTerm: string) => {
        const trimmed = searchTerm.trim();

        setLoading(true);
        try {
            const wildcardTerm = `%${trimmed}%`;
            const response = await getEmployee({ full_name: wildcardTerm });
            setResults(response);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce(fetchEmployees, 500), []);

    return (

        <AltCard style={{ backgroundColor: Colors.white}}>

            <TextInput
                value={query}
                onChangeText={handleChange}
                placeholder="Search Staff by Name"
                style={styles.input}
            />

            {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

            <View>
                <ScrollView horizontal style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.tableContainer}>
                        {renderHeader()}
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.employee_id?.toString() ?? Math.random().toString()}
                            renderItem={renderItem}
                            scrollEnabled={false}
                        />
                    </View>
                </ScrollView >
            </View >



            {/* Fallback */}
            {!loading && results.length === 0 && query.length > 0 && (
                <Text style={{ marginTop: 20, textAlign: "center" }}>No staff found.</Text>
            )}

        </AltCard>

    );

};

const styles = StyleSheet.create({
    searchContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        padding: 8,
        marginBottom: 12,
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
        flex: 1,            // expands horizontally within the ScrollView
        width: "100%",      // explicitly matches parent width
        alignSelf: "stretch"
    },
    headerText: {
        fontWeight: "bold",
        textAlign: "left",
    },
});
