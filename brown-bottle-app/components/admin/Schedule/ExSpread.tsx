import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Card from "@/components/modular/Card";

const NAME_COL_W = 120;
const COL_W = 60;
const ROW_H = 40;
const HEADER_H = 50;

const ExSpread = () => {
  const dates = ["9/4", "9/5", "9/6", "9/7", "9/8", "9/9", "9/10"];
  const days  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // lots of sample rows
  const employees = [
    { name: "Employee 1",  shifts: ["8-5","","","8-5","8-5","9-3",""] },
    { name: "Employee 2",  shifts: ["8-5","3-9","3-9","8-5","","9-3","9-3"] },
    { name: "Employee 3",  shifts: ["3-9","3-9","","9-3","8-5","9-3",""] },
    { name: "Employee 4",  shifts: ["","8-5","8-5","","3-9","3-9","8-5"] },
    { name: "Employee 5",  shifts: ["9-3","","9-3","8-5","","8-5","8-5"] },
    { name: "Employee 6",  shifts: ["","","3-9","3-9","8-5","","8-5"] },
    { name: "Employee 7",  shifts: ["8-5","8-5","","8-5","9-3","9-3",""] },
    { name: "Employee 8",  shifts: ["","9-3","9-3","8-5","8-5","",""] },
    { name: "Employee 9",  shifts: ["8-5","","8-5","","8-5","","9-3"] },
    { name: "Employee 10", shifts: ["","8-5","","9-3","9-3","8-5",""] },
    { name: "Employee 11", shifts: ["3-9","3-9","","","8-5","8-5","9-3"] },
    { name: "Employee 12", shifts: ["9-3","","","8-5","8-5","",""] },
  ];

  const [hover, setHover] = useState({ r: -1, c: -1 });

  // const handleCellPress = (r, c) => {
  //   // do something (open detail, edit, etc.)
  //   console.log(`Cell press: row ${r}, col ${c}`);
  // };

  return (
    <View style={styles.container}>
      <Card>
        <ScrollView horizontal>
          <View>
            {/* Header row (uses your headerCell style) */}
            <View style={styles.row}>
              <View style={[styles.headerCell, { width: NAME_COL_W, height: HEADER_H }]}>
                <Text numberOfLines={1}>Employee Name</Text>
              </View>
              {dates.map((date, i) => (
                <View
                  key={i}
                  style={[styles.headerCell, { width: COL_W, height: HEADER_H }]}
                >
                  <Text numberOfLines={1}>{date}</Text>
                  <Text numberOfLines={1}>{days[i]}</Text>
                </View>
              ))}
            </View>

            {/* Data grid */}
            <ScrollView style={{ maxHeight: 420 }}>
              {employees.map((emp, r) => (
                <View key={r} style={styles.row}>
                  {/* name column styled like your cell but slightly bolder */}
                  <View style={[styles.cell, { width: NAME_COL_W, height: ROW_H, backgroundColor: "#fafafa" }]}>
                    <Text numberOfLines={1}>{emp.name}</Text>
                  </View>

                  {emp.shifts.map((shift, c) => (
                    <Pressable
                      key={c}
                      // onPress={() => handleCellPress(r, c)}
                      // Web hover (no-op on native)
                      onHoverIn={() => setHover({ r, c })}
                      onHoverOut={() => setHover({ r: -1, c: -1 })}
                      style={({ pressed }) => ([
                        styles.cell,
                        { width: COL_W, height: ROW_H },
                        // hover highlight (web)
                        hover.r === r && hover.c === c ? { backgroundColor: "#e6f0ff" } : null,
                        // press highlight (mobile)
                        pressed ? { backgroundColor: "#dbeafe" } : null,
                      ])}
                    >
                      <Text numberOfLines={1} ellipsizeMode="clip">{shift}</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  // EXACTLY your container styling (plus overflow so rounded corners clip)
  container: {
    marginTop: 15,
    width: "95%",
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 9,
    overflow: "hidden",
  },
  // EXACTLY your row styling
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  // EXACTLY your headerCell styling, but height/width set per-usage
  headerCell: {
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  // EXACTLY your cell styling, but we center content to mimic a spreadsheet
  cell: {
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ExSpread;
