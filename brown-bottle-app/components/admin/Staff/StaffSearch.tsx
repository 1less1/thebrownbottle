import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import { debounce } from "lodash";
import { Employee } from "@/types/api";
import { getEmployee } from "@/utils/api/employee";

const columns = ["ID", "Name", "Email", "Phone", "Primary", "Secondary"] as const;

const columnStyles: Record<string, object> = {
  ID: { minWidth: 50 },
  Name: { minWidth: 130 },
  Email: { minWidth: 200 },
  Phone: { minWidth: 140 },
  Primary: { minWidth: 120 },
  Secondary: { minWidth: 120 },
};

export default function StaffSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

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

  const handleChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      {columns.map((col) => (
        <Text key={col} style={[styles.cell, styles.headerText, columnStyles[col]]}>
          {col}
        </Text>
      ))}
    </View>
  );

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, columnStyles.ID]}>{item.employee_id ?? "-"}</Text>
      <Text style={[styles.cell, columnStyles.Name]}>
        {`${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "-"}
      </Text>
      <Text style={[styles.cell, columnStyles.Email]}>{item.email ?? "-"}</Text>
      <Text style={[styles.cell, columnStyles.Phone]}>{item.phone_number ?? "-"}</Text>
      <Text style={[styles.cell, columnStyles.Primary]}>
        {item.primary_role_name ?? item.primary_role ?? "-"}
      </Text>
      <Text style={[styles.cell, columnStyles.Secondary]}>
        {item.secondary_role_name ?? item.secondary_role ?? "-"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={handleChange}
        placeholder="Search staff by name"
        style={styles.input}
      />

      {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

      <ScrollView horizontal>
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.employee_id?.toString() ?? index.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          ListEmptyComponent={
            !loading && query !== "" ? (
              <Text style={styles.noResults}>No results found</Text>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerRow: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
  cell: {
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#eee",
    fontSize: 13,
  },
  headerText: {
    fontWeight: "bold",
  },
  noResults: {
    textAlign: "center",
    color: "#888",
    padding: 12,
  },
});
