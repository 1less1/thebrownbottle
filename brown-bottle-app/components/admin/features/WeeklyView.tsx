import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Card from '@/components/Card';
import {Colors} from '@/constants/Colors';

// Define the structure of shift details
interface ShiftDetails {
  employee: {
    name: string;
    role: string;
  };
  day: string;
  shift: string;
}

// List of weekdays
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Sample employee shift data
const employees = [
  { name: "Alex Johnson", role: "Server", shifts: ["OFF", "9-5", "9-5", "OFF", "4-10", "4-10", "OFF"] },
  { name: "Sarah Williams", role: "Bartender", shifts: ["4-10", "4-10", "OFF", "OFF", "4-10", "4-10", "4-10"] },
  { name: "Michael Chen", role: "Server", shifts: ["9-5", "9-5", "9-5", "9-5", "OFF", "OFF", "9-5"] },
  { name: "Emily Davis", role: "Host", shifts: ["OFF", "4-10", "4-10", "4-10", "4-10", "OFF", "4-10"] },
  { name: "David Wilson", role: "Kitchen", shifts: ["8-4", "8-4", "OFF", "8-4", "8-4", "8-4", "OFF"] },
];

export default function WeeklyView() {
  const [selectedShift, setSelectedShift] = useState<ShiftDetails | null>(null);

  return (
    <View>
    <Text style={{fontWeight:'bold',textAlign:'left', marginBottom:10, fontSize:20, paddingLeft:15}}>Weekly Schedule</Text>

      <Card style={styles.CardContainer}>

        <ScrollView horizontal>
          <View>
            {/* Header Row */}
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>Employee</Text>
              {days.map((day, index) => (
                <Text key={index} style={styles.headerCell}>{day}</Text>
              ))}
            </View>

            {/* Employee Shifts */}
            {employees.map((employee, i) => (
              <View key={i} style={styles.row}>
                {/* Employee Info */}
                <View style={[styles.cell, styles.employeeCell]}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeeRole}>{employee.role}</Text>
                </View>

                {/* Shift Cells */}
                {employee.shifts.map((shift, j) => (
                  <TouchableOpacity
                    key={j}
                    style={[styles.cell, shift === "OFF" ? styles.offShift : styles.activeShift]}
                    onPress={() => setSelectedShift({ employee, day: days[j], shift })}
                  >
                    <Text style={styles.shiftText}>{shift}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>

      </Card>
      </View>
  );
}

// Styles
const styles = StyleSheet.create({
  CardContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.greyWhite,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cell: {
    flex: 1,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  employeeCell: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  employeeName: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 10,
    marginRight: 5,
  },
  employeeRole: {
    fontSize: 16,
    color: '#666',
  },
  offShift: {
    backgroundColor: '#f5f5f5',
  },
  activeShift: {
    backgroundColor: '#fff',
  },
  shiftText: {
    fontSize: 18,
  },
});



