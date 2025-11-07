import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, useWindowDimensions, TouchableOpacity, Pressable } from "react-native";
import { debounce } from "lodash";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import RoleDropdown from "@/components/modular/RoleDropdown";
import SectionDropdown from "@/components/modular/SectionDropdown"
import ModularButton from "@/components/modular/ModularButton";
import LoadingCircle from "@/components/modular/LoadingCircle";

import { ScheduleData, ScheduleEmployee, ShiftDisplay } from "@/types/iApi";
import { getScheduleData, processScheduleForSpreadsheet } from "@/utils/api/shift";

import { Section } from "@/types/iApi";
import { getSection } from "@/utils/api/section";

import Toast from "react-native-toast-message";

import ShiftModal from "@/components/admin/Schedule/ShiftModal";
import { createShift, updateShift, deleteShift } from "@/utils/api/shift";

interface StaffSearchProps {
  refreshTrigger?: number;
  onRefreshDone?: () => void;
}


const SpreadSheet: React.FC<StaffSearchProps> = ({ refreshTrigger, onRefreshDone }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { height } = useWindowDimensions();

  // Search and filter state
  const [query, setQuery] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<ScheduleEmployee | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShift, setSelectedShift] = useState<ShiftDisplay | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Schedule-specific state
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToSubtract);

    // ✅ Normalize to local midnight to prevent sub-day offsets
    monday.setHours(0, 0, 0, 0);
    return monday;
  });


  const [sections, setSections] = useState<Section[]>([]);

  const fetchScheduleData = async (searchTerm: string) => {
    setLoading(true);
    try {
      // Calculate week end date (Sunday)
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);

      // Build filter parameters - SINGLE API CALL with include_all_employees
      const params: any = {
        start_date: currentWeekStart.toISOString().split('T')[0],
        end_date: weekEnd.toISOString().split('T')[0],
        include_all_employees: true  // NEW: Request all employees
      };

      // Add optional filters
      if (selectedSectionId !== -1) {
        params.section_id = selectedSectionId;
      }

      if (selectedRoleId !== -1) {
        params.role_id = selectedRoleId;
      }

      if (searchTerm.trim()) {
        params.employee_name = `%${searchTerm.trim()}%`;
      }

      // Fetch from API - NOW INCLUDES ALL EMPLOYEES
      const data = await getScheduleData(params);

      // Process into spreadsheet format
      const processedData = processScheduleForSpreadsheet(
        data,
        currentWeekStart,
        7
      );

      setScheduleData(processedData);
    } catch (err) {
      console.error("Schedule fetch failed:", err);
    } finally {
      setLoading(false);
      onRefreshDone?.();
    }
  };
  // Debounce search
  const debouncedSearch = useCallback(debounce(fetchScheduleData, 500), [
    currentWeekStart,
    selectedRoleId,
    selectedSectionId
  ]);

  const handleSearchChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  // Refetch when filters or week changes
  useEffect(() => {
    fetchScheduleData(query);
  }, [selectedRoleId, selectedSectionId, currentWeekStart, refreshTrigger]);

  const handleReset = () => {
    if (query !== "" || selectedRoleId !== null) {
      setQuery(""); // Set Query to empty
      setSelectedRoleId(null);
      fetchScheduleData(query);
    }

  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getSection();
        setSections(data);
      } catch (err) {
        console.error("Failed to fetch sections:", err);
      }
    };

    fetchSections();
  }, []);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    if (direction === 'prev') {
      newWeekStart.setDate(currentWeekStart.getDate() - 7);
    } else {
      newWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    // ✅ Normalize again
    newWeekStart.setHours(0, 0, 0, 0);
    setCurrentWeekStart(newWeekStart);
  };


  const getWeekDateRange = () => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);

    const startStr = `${currentWeekStart.getMonth() + 1}/${currentWeekStart.getDate()}`;
    const endStr = `${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    const year = currentWeekStart.getFullYear();

    return `${startStr} - ${endStr}, ${year}`;
  };

  // Responsive column widths
  // Mobile: use fixed widths (150px for name, 120px per day)
  // Tablet/Desktop: use percentage-based widths but with minimums
  const isMobile = screenWidth < 768;

  const NAME_COL_WIDTH = isMobile
    ? 135
    : Math.max(135, screenWidth * 0.12);

  const DAY_COL_WIDTH = isMobile
    ? 135
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

  const handleCellPress = (
    employee: ScheduleEmployee,
    dayIndex: number,
    shift: ShiftDisplay | null
  ) => {
    // Calculate the actual date for this day
    const clickedDate = new Date(currentWeekStart);
    clickedDate.setDate(currentWeekStart.getDate() + dayIndex);

    // Store context for modal
    setSelectedEmployee(employee);
    setSelectedDate(clickedDate);
    setSelectedShift(shift);
    setSelectedDayIndex(dayIndex);

    // Open modal
    setModalVisible(true);


  };


  const handleAddShift = async (startTime: string, endTime: string, sectionId: number) => {
    if (!selectedEmployee || !selectedDate) return;

    try {
      const dateStr = selectedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD

      await createShift(
        selectedEmployee.employee_id,
        dateStr,
        startTime,
        endTime,
        sectionId
      );

      // Refresh the schedule to show new shift
      await fetchScheduleData(query);

      // Close modal
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to add shift:", error);
      throw error; // Let modal handle the error display
    }
  };

  const handleEditShift = async (
    shiftId: number,
    startTime: string,
    endTime: string,
    sectionId: number
  ) => {
    try {
      await updateShift(shiftId, {
        start_time: startTime,
        end_time: endTime,
        section_id: sectionId
      });

      // Refresh the schedule
      await fetchScheduleData(query);

      // Close modal
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to edit shift:", error);
      throw error;
    }
  };

  const handleDeleteShift = async (shiftId: number) => {
    try {
      await deleteShift(shiftId);

      // Refresh schedule data after deletion
      await fetchScheduleData(query);

      Toast.show({
        type: "success",
        text1: "Shift deleted",
        position: "bottom",
      });

      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting shift:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete shift",
        position: "bottom",
      });
    }
  };



  return (
    <Card style={{ backgroundColor: Colors.white, paddingVertical: 6, height: height * 0.67 }}>

      {/* Week Navigation */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateWeek('prev')}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        <View style={styles.weekDisplay}>
          <Text style={styles.weekText}>{getWeekDateRange()}</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Header */}
              {renderHeader()}

              {/* Employee Rows */}
              <ScrollView style={{ maxHeight: height * 0.7 }}>
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
        onAddShift={handleAddShift}
        onEditShift={handleEditShift}
        onDeleteShift={handleDeleteShift}
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