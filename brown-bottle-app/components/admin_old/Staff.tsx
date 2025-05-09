import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, View, FlatList } from 'react-native';
import AltCard from '@/components/AltCard';
import { Colors } from '@/constants/Colors';

// Sample employee shift data
const employees = [
  { name: "Alex Johnson", role: "Server", shifts: ["OFF", "9-5", "9-5", "OFF", "4-10", "4-10", "OFF"] },
  { name: "Sarah Williams", role: "Bartender", shifts: ["4-10", "4-10", "OFF", "OFF", "4-10", "4-10", "4-10"] },
  { name: "Michael Chen", role: "Server", shifts: ["9-5", "9-5", "9-5", "9-5", "OFF", "OFF", "9-5"] },
  { name: "Emily Davis", role: "Host", shifts: ["OFF", "4-10", "4-10", "4-10", "4-10", "OFF", "4-10"] },
  { name: "David Wilson", role: "Kitchen", shifts: ["8-4", "8-4", "OFF", "8-4", "8-4", "8-4", "OFF"] },
];

// Days of the week for better readability
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Staff() {
  const [text, setText] = useState('');

  // Filter employees based on the search text
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(text.toLowerCase()) || 
    employee.role.toLowerCase().includes(text.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: Colors.greyWhite }}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Search Employees Here"
        placeholderTextColor="gray"
      />

      {/* FlatList handles its own scrolling */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <AltCard style={styles.employeeCard}>
            <Text style={styles.employeeText}>{item.name}</Text>
            <Text style={styles.employeeRole}>{item.role}</Text>
          </AltCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.borderColor,
  },
  employeeCard: {
    backgroundColor: Colors.white,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
    padding: 10,
  },
  employeeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeRole: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
});
