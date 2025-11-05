import React, { useState, useCallback, useEffect, useMemo } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, useWindowDimensions, TouchableOpacity, Pressable } from "react-native";
import { debounce } from "lodash";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";

import RoleDropdown from "@/components/modular/RoleDropdown";
import SectionDropdown from "@/components/modular/SectionDropdown"

import ModularButton from "@/components/modular/ModularButton";
import LoadingCircle from "@/components/modular/LoadingCircle";

import ShiftModal from "@/components/admin/Schedule/ShiftModal";

import { Section } from "@/types/api";
import { getSection } from "@/utils/api/section";

import { ScheduleData, ScheduleEmployee, ShiftDisplay } from "@/types/api";
import { getScheduleData, processScheduleForSpreadsheet } from "@/utils/api/shift";

import { Shift, ShiftAPI } from "@/types/api";

import { getShift, createShift, updateShift, deleteShift } from "@/utils/api/shift";

import Toast from "react-native-toast-message";



const shiftTodayOptions = [
  { value: 1, key: "Yes" },
  { value: 0, key: "No" },
];

interface SpreadSheetProps {
  parentRefresh?: number;
  onRefreshDone?: () => void;
}


const SpreadSheet: React.FC<SpreadSheetProps> = ({ parentRefresh, onRefreshDone }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { height } = useWindowDimensions();

  const [localRefresh, setLocalRefresh] = useState(0);
  const [loading, setLoading] = useState(false);

  // Search and filter state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Shift[]>([]);

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedTodayOption, setSelectedTodayOption] = useState<number>(0) // Default value is_today=0 (False)

  const fetchShifts = async (searchTerm: string) => {
    setLoading(true);

    try {
      const weekStartStr = currentWeekStart.toISOString().split("T")[0];
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);
      const weekEndStr = weekEnd.toISOString().split("T")[0];

      const params: Partial<ShiftAPI> = {
        start_date: weekStartStr,
        end_date: weekEndStr,
        full_name: searchTerm.trim() ? `%${searchTerm.trim()}%` : undefined,
        section_id: selectedSectionId ?? undefined,
        primary_role: selectedRoleId ?? undefined,
        secondary_role: selectedRoleId ?? undefined,
        tertiary_role: selectedRoleId ?? undefined,
      };

      const rawShifts: Shift[] = await getShift(params);
      setResults(rawShifts);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      fetchShifts(searchTerm);
    }, 500),
    [selectedSectionId, selectedRoleId, selectedTodayOption]
  );

  const handleSearchChange = (searchTerm: string) => {
    setQuery(searchTerm);
    debouncedSearch(searchTerm);
  };

  const triggerRefresh = (searchTerm: string) => {
    fetchShifts(searchTerm);
  };

  const handleReset = () => {
    if (query !== "" || selectedSectionId !== null || selectedRoleId !== null || selectedTodayOption !== 0) {
      debouncedSearch.cancel();
      setQuery("");
      setSelectedSectionId(null);
      setSelectedRoleId(null);
      setSelectedTodayOption(0);
      setLocalRefresh((prev) => prev + 1); // triggers refresh
    }
  };

  // ------- Dom Edits Above -------------------------------------------------------------------------------------------------------------------------------------

  // Modal and selection state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<ScheduleEmployee | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShift, setSelectedShift] = useState<ShiftDisplay | null>(null);

  // Helper to get Monday of a given date
  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // if Sunday, go back 6 days
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Initialize current week start
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getMonday(new Date()));

  // Navigate weeks
  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeekStart(prev => {
      const newWeek = new Date(prev);
      newWeek.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newWeek;
    });
  };

  // Format week range for display
  const getWeekDateRange = (start: Date) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

    return `${formatDate(start)} - ${formatDate(end)}, ${start.getFullYear()}`;
  };

  const scheduleData = useMemo(() => {
    return processScheduleForSpreadsheet(results, currentWeekStart, 7);
  }, [results, currentWeekStart]);


  // Fetch Shifts on Initialization and State Update
  useEffect(() => {
    triggerRefresh(query);
  }, [selectedSectionId, selectedRoleId, selectedTodayOption, currentWeekStart, parentRefresh, localRefresh]);




  // Responsive column widths
  // Mobile: use fixed widths (150px for name, 120px per day)
  // Tablet/Desktop: use percentage-based widths but with minimums
  const isMobile = screenWidth < 768;

  const NAME_COL_WIDTH = isMobile
    ? 135
    : Math.max(135, screenWidth * 0.12);

  const DAY_COL_WIDTH = isMobile
    ? 120
    : scheduleData
      ? Math.max(120, (screenWidth * 0.70) / scheduleData.dates.length)
      : 120;

  const ROW_HEIGHT = 50;
  const HEADER_HEIGHT = 44;

  // Header with dates
  const renderHeader = () => {
    if (!scheduleData) return null;

    return (
      <View style={[styles.row, styles.headerRow]}>
        {/* Employee name column */}
        <View style={[styles.headerCell, { width: NAME_COL_WIDTH, height: HEADER_HEIGHT }]}>
          <Text style={styles.headerText}>Employee</Text>
        </View>

        {/* Date columns */}
        {scheduleData.dates.map((date, i) => (
          <View
            key={i}
            style={[styles.headerCell, { width: DAY_COL_WIDTH, height: HEADER_HEIGHT }]}
          >
            <Text style={styles.headerText}>{scheduleData.dayNames[i]}</Text>
            <Text style={styles.subHeaderText}>{date}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Employee row with shifts
  const renderEmployeeRow = (employee: ScheduleEmployee) => (
    <View key={employee.employee_id} style={styles.row}>
      {/* Employee name cell */}
      <View style={[styles.nameCell, { width: NAME_COL_WIDTH, height: ROW_HEIGHT }]}>
        <Text style={styles.employeeName}>{employee.employee_name}</Text>
        <Text style={styles.employeeRole}>({employee.primary_role_name})</Text>
      </View>

      {/* Shift cells */}
      {employee.shifts.map((shift, dayIndex) => (
        <Pressable
          key={dayIndex}
          onPress={() => handleCellPress(employee, dayIndex, shift)}
          style={({ hovered }) => [
            styles.shiftCell,
            { width: DAY_COL_WIDTH, height: ROW_HEIGHT },
            hovered && styles.shiftCellHovered,
          ]}
        >
          {shift ? (
            <View style={styles.shiftContent}>
              <Text style={styles.shiftTime}>{shift.time}</Text>
              <Text style={styles.shiftSection}>{shift.section}</Text>
            </View>
          ) : (
            <Text style={styles.noShift}>-</Text>
          )}
        </Pressable>
      ))}
    </View>
  );

  const handleCellPress = (employee: ScheduleEmployee, dayIndex: number, shift: ShiftDisplay | null) => {
    const clickedDate = new Date(currentWeekStart);
    clickedDate.setDate(currentWeekStart.getDate() + dayIndex);

    setSelectedEmployee(employee);
    setSelectedShift(shift);

    setSelectedDate(clickedDate);  // <-- add this
    setModalVisible(true);
  };



  return (
    <Card style={{ backgroundColor: Colors.white, paddingVertical: 6, height: height * 0.7 }}>

      {/* Week Navigation */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateWeek('prev')}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        <View style={styles.weekDisplay}>
          <Text style={styles.weekText}>{getWeekDateRange(currentWeekStart)}</Text>

        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateWeek('next')}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
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

      <View style={styles.filterContainer}>
        <RoleDropdown
          selectedRoleId={selectedRoleId}
          onRoleSelect={(value) => setSelectedRoleId(value as number)}
          labelText=""
          containerStyle={styles.dropdownButton}
        />
        <SectionDropdown
          selectedSectionId={selectedSectionId}
          onSectionSelect={(value) => setSelectedSectionId(value as number)}
          labelText=""
          containerStyle={styles.dropdownButton}
        />
      </View>

      {loading && <LoadingCircle size="small" style={{ marginTop: 10, alignSelf: 'center' }} />}

      {/* Schedule Spreadsheet */}
      {scheduleData && (
        <View style={{ flex: 1 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} keyboardShouldPersistTaps="handled">
            <View>
              {/* Header */}
              {renderHeader()}

              {/* Employee Rows */}
              <ScrollView style={{ maxHeight: height * 0.7 }} keyboardShouldPersistTaps="handled">
                {scheduleData.employees.length > 0 ? (
                  scheduleData.employees.map(renderEmployeeRow)
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No schedule data found</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Fallback for no data */}
      {!loading && scheduleData && scheduleData.employees.length === 0 && (
        <Text style={[GlobalStyles.text, { marginTop: 20, textAlign: "center" }]}>
          No shifts scheduled for this week
        </Text>
      )}

      <ShiftModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        employee={selectedEmployee}
        date={selectedDate}
        shift={selectedShift}
      />

    </Card>
  );
};
const styles = StyleSheet.create({
  // Navigation
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white
  },
  navButton: {
    borderRadius: 5,
    backgroundColor: Colors.darkTan,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  weekDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  weekText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Search and filters
  searchContainer: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    flexGrow: 1,
    padding: 8,
    borderRadius: 4,
  },
  dropdownButton: {
    minWidth: 0,
    alignSelf: "flex-start",
  },

  // Schedule grid
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.lightBorderColor,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderRightWidth: 5
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
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },

  // Employee name cell
  nameCell: {
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#fafafa',
    borderRightWidth: 1,
    borderColor: Colors.lightBorderColor,
  },
  employeeName: {
    fontWeight: '600',
    fontSize: 15,
  },
  employeeRole: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },

  // Shift cells
  shiftCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#eee',
    padding: 4,
  },
  shiftContent: {
    alignItems: 'center',
  },
  shiftTime: {
    fontWeight: '600',
    fontSize: 12,
  },
  shiftSection: {
    fontSize: 12,
    color: '#666',
  },
  noShift: {
    color: '#ccc',
    fontSize: 14,
  },
  shiftCellHovered: {
    backgroundColor: Colors.lightGray,
    opacity: 0.6,
  },
  // Empty state
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
  },
});

export default SpreadSheet;