import React from 'react'
import { View, Text, StyleSheet, ScrollView, useWindowDimensions  } from 'react-native'
import Card from '@/components/modular/Card'

// Spreadsheet dimensions
// const NAME_COL_W = 180; // Employee column
// const COL_W = 100;      // Day columns
const ROW_H = 36;
const HEADER_H = 44;

const spreadsheet = () => {

  const { width: screenWidth } = useWindowDimensions()

  // Sample data
  const dates = ["9/4", "9/5", "9/6", "9/7", "9/8", "9/9", "9/10", ];
  const days  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const employees = [
  { name: "Alice Johnson", shifts: ["8-5", "", "", "8-5", "8-5", "9-3", ""] },
  { name: "Bob Smith", shifts: ["8-5", "3-9", "3-9", "8-5", "", "9-3", "9-3"] },
  { name: "Carlos Martinez", shifts: ["3-9", "3-9", "", "9-3", "8-5", "9-3", ""] },
  { name: "Diana Lee", shifts: ["", "8-5", "8-5", "", "3-9", "3-9", "8-5"] },
  { name: "Ethan Brown", shifts: ["9-3", "", "9-3", "8-5", "", "8-5", "8-5"] },
  { name: "Fiona Davis", shifts: ["", "", "3-9", "3-9", "8-5", "", "8-5"] },
  { name: "George Wilson", shifts: ["8-5", "8-5", "", "8-5", "9-3", "9-3", ""] },
  { name: "Hannah Miller", shifts: ["", "9-3", "9-3", "8-5", "8-5", "", ""] },
  { name: "Ian Clark", shifts: ["9-3", "8-5", "", "9-3", "", "8-5", ""] },
  { name: "Jasmine Taylor", shifts: ["8-5", "", "3-9", "", "8-5", "3-9", ""] },
  { name: "Kevin Anderson", shifts: ["", "9-3", "", "9-3", "8-5", "9-3", "8-5"] },
  { name: "Laura Thomas", shifts: ["8-5", "8-5", "8-5", "", "3-9", "", ""] },
  { name: "Michael Harris", shifts: ["", "", "9-3", "9-3", "8-5", "", "8-5"] },
  { name: "Nina Rodriguez", shifts: ["3-9", "3-9", "8-5", "8-5", "", "9-3", ""] },
  { name: "Oscar Lewis", shifts: ["", "9-3", "", "", "8-5", "8-5", "8-5"] },
  { name: "Priya Patel", shifts: ["8-5", "", "9-3", "8-5", "", "", "9-3"] },
  { name: "Quinn Walker", shifts: ["3-9", "8-5", "8-5", "3-9", "", "9-3", ""] },
  { name: "Riley Hall", shifts: ["", "", "9-3", "9-3", "", "8-5", "8-5"] },
  { name: "Sophia Young", shifts: ["8-5", "3-9", "", "", "8-5", "3-9", "8-5"] },
  { name: "Tommy Evans", shifts: ["9-3", "", "9-3", "8-5", "9-3", "", ""] },
]

//  Dynamic widths: 25% for name column, 75% split between days
  const NAME_COL_W = screenWidth * 0.25
  const COL_W = (screenWidth * 0.75) / dates.length

  return (
    <View style={styles.container}>
      <Card>
        <ScrollView horizontal>
          <View>

            {/* Header row */}
             <View style={[styles.row, styles.headerRow]}>
              <View style={[styles.headerCell, { width: NAME_COL_W, height: HEADER_H }]}>
                <Text style={styles.headerText}>Employee Name</Text>
              </View>
              {dates.map((date, i) => (
                <View
                  key={i}
                  style={[styles.headerCell, { width: COL_W, height: HEADER_H }]}
                  >
                    <Text>{date}</Text>
                    <Text>{days[i]}</Text>
                </View>    
              ))}
             </View>

              {/* Employee Rows */}
              <ScrollView style={{ maxHeight: 500 }}>
                {employees.map((emp,r) => (
                  <View key={r} style={styles.row}>
                    <View style={[styles.cell, { width: NAME_COL_W, height: ROW_H, backgroundColor: "#fafafa" }]}>
                      <Text style={styles.nameText}>{emp.name}</Text>
                    </View>
                  {emp.shifts.map((shift, c) => (
                      <View
                        key={c}
                        style={[styles.cell, { width: COL_W, height: ROW_H }]}
                      >
                      <Text>{shift}</Text>
                    </View>
                  ))}
                </View>
                ))}
              </ScrollView>

            </View>
          </ScrollView>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth:"95%",
    marginTop: 15,
    marginHorizontal:"2.5%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgrey',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  headerRow: {
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    padding: 4,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  cell: {
    borderRightWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  subHeader: {
    fontSize: 11,
    color: "#555",
  },
  nameText: {
    fontWeight: "600",
    fontSize: 12,
  },
  cellText: {
    fontSize: 12,
  },
})

export default spreadsheet


