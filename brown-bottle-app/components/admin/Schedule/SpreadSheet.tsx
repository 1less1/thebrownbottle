import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, ScrollView, FlatList, StyleSheet, useWindowDimensions, TouchableOpacity, Pressable } from "react-native";
import { debounce } from "lodash";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import RoleDropdown from "@/components/modular/RoleDropdown";
import SectionDropdown from "@/components/modular/SectionDropdown";
import ModularDropdown from "@/components/modular/ModularDropdown";
import ModularButton from "@/components/modular/ModularButton";
import LoadingCircle from "@/components/modular/LoadingCircle";
import ShiftModal from "@/components/admin/Schedule/ShiftModal";

import { formatSQLDate, formatDateNoTZ } from "@/utils/dateTimeHelpers";
import { ScheduleEmployee, ScheduleShift } from "@/types/iShift";
import { getSchedule, getSunday, navigateWeek, getWeekDateRange, getWeekDates } from "@/routes/schedule";
import { getTimeOffRequests } from "@/routes/time_off_request";
import { buildBlockedDaysMap, attachBlockedDays } from "@/routes/schedule";

interface SpreadSheetProps {
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

const isTodayOptions = [
  { value: 1, key: "Yes" },
  { value: 0, key: "No" },
];

const SpreadSheet: React.FC<SpreadSheetProps> = ({ parentRefresh }) => {
  const { width: screenWidth, height } = useWindowDimensions();

  const [query, setQuery] = useState("");

  const [localRefresh, setLocalRefresh] = useState(0);
  const [loading, setLoading] = useState(false);

  const [scheduleData, setScheduleData] = useState<ScheduleEmployee[]>([]);
  const [selectedShift, setSelectedShift] = useState<ScheduleShift | null>(null);

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [isToday, setIsToday] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<ScheduleEmployee | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getSunday(new Date()));

  const fetchSchedule = async (searchTerm: string) => {
    setLoading(true);
    try {
      const weekStartStr = currentWeekStart.toISOString().split("T")[0];
      const weekEndStr = new Date(currentWeekStart.getTime() + 6 * 86400000)
        .toISOString()
        .split("T")[0];

      const params: Record<string, any> = {
        full_name: searchTerm.trim() ? `%${searchTerm.trim()}%` : undefined,
        is_today: isToday,
        role_id: selectedRoleId ?? undefined,
        section_id: selectedSectionId ?? undefined,
      };

      if (isToday === 0) {
        params.start_date = weekStartStr;
        params.end_date = weekEndStr;
      }

      const schedule: ScheduleEmployee[] = await getSchedule(params);

      // Fetch accepted time off requests
      const timeOff = await getTimeOffRequests({
        status: "Accepted",
      });

      // Build blocked days
      const blockedDays = buildBlockedDaysMap(timeOff);

      // Attach to schedule
      const updatedSchedule = attachBlockedDays(schedule, blockedDays);
      console.log("UPDATED SCHEDULE EMPLOYEE:", updatedSchedule[0]);

      setScheduleData(updatedSchedule);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      alert("Error fetching schedule!")
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      fetchSchedule(searchTerm);
    }, 500),
    [selectedSectionId, selectedRoleId, isToday, currentWeekStart]
  );

  const handleSearchChange = (searchTerm: string) => {
    setQuery(searchTerm);
    debouncedSearch(searchTerm);
  };

  const triggerRefresh = (searchTerm: string) => {
    setQuery(searchTerm);
    debouncedSearch.cancel();
    debouncedSearch(searchTerm);
  }

  const handleReset = () => {
    if (query != "" || selectedSectionId !== null || selectedRoleId != null || isToday != 0) {
      debouncedSearch.cancel();
      setQuery("");
      setSelectedSectionId(null);
      setSelectedRoleId(null);
      setIsToday(0);
      setLocalRefresh((prev) => prev + 1);
    }
  };

  // Fetch Schedule Data on Initialization and State Update
  useEffect(() => {
    triggerRefresh(query)
  }, [selectedSectionId, selectedRoleId, isToday, currentWeekStart, parentRefresh, localRefresh]);

  // Layout Calculations
  const isMobile = screenWidth < 768;
  const NAME_COL_WIDTH = isMobile ? 135 : Math.max(135, screenWidth * 0.12);
  const weekDays = getWeekDates(currentWeekStart, 7);
  const DAY_COL_WIDTH = isMobile ? 120 : Math.max(120, (screenWidth * 0.70) / weekDays.length);
  const ROW_HEIGHT = 50;
  const HEADER_HEIGHT = 44;

  const handleCellPress = (employee: ScheduleEmployee, dayIndex: number, shift: ScheduleShift | null) => {
    const clickedDate = new Date(currentWeekStart);
    clickedDate.setDate(currentWeekStart.getDate() + dayIndex);
    setSelectedEmployee(employee);
    setSelectedShift(shift);
    const sqlDate = formatSQLDate(clickedDate); // "2025-11-06"
    setSelectedDate(sqlDate);
    setModalVisible(true);
  };


  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <View style={[styles.headerCell, { width: NAME_COL_WIDTH, height: HEADER_HEIGHT }]}>
        <Text style={styles.headerText}>Employee</Text>
      </View>
      {weekDays.map((d, i) => (
        <View key={i} style={[styles.headerCell, { width: DAY_COL_WIDTH, height: HEADER_HEIGHT }]}>
          <Text style={styles.headerText}>{d.dayName}</Text>
          <Text style={styles.subHeaderText}>{formatDateNoTZ(d.date)}</Text>
        </View>
      ))}
    </View>
  );

  const renderEmployeeRow = (employee: ScheduleEmployee) => {
    return (
      <View key={employee.employee_id} style={styles.row}>

        {/* Employee Info */}
        <View style={[styles.nameCell, { width: NAME_COL_WIDTH, height: ROW_HEIGHT }]}>
          <Text style={styles.employeeName}>{employee.full_name}</Text>
          <Text style={styles.employeeRole}>({employee.primary_role_name})</Text>
        </View>

        {employee.shifts.map((shift, dayIndex) => {

          const dateStr = weekDays[dayIndex].date;
          const isDisabled = employee.blockedDays?.has(dateStr) ?? false;

          return (
            // Shift Cell Press Logic with support for No Shift (Null) and Blocked/Time Off Shifts (Disabled)
            <Pressable
              key={dayIndex}
              disabled={isDisabled}
              onPress={
                isDisabled
                  ? undefined
                  : () => handleCellPress(employee, dayIndex, shift)
              }
              style={({ hovered }) => [
                styles.shiftCell,
                { width: DAY_COL_WIDTH, height: ROW_HEIGHT },
                hovered && !isDisabled && styles.shiftCellHovered,
                isDisabled && styles.shiftCellDisabled,
              ]}
            >
              {shift ? (
                <View style={styles.shiftContent}>
                  <Text style={[styles.shiftTime, isDisabled && styles.shiftTextDisabled]}>
                    {shift.start_time}
                  </Text>
                  <Text style={[styles.shiftSection, isDisabled && styles.shiftTextDisabled]}>
                    {shift.section_name}
                  </Text>
                </View>
              ) : (
                <Text style={styles.noShift}>-</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (

    <Card style={{ backgroundColor: Colors.white, paddingVertical: 6, height: height * 0.70 }}> {/* OLD: height: height * 0.67 */}

      {/* Navigation Header */}
      <View style={styles.navigationHeader}>
        {/* Previous Button */}
        <TouchableOpacity
          style={[styles.navButton, isToday === 1 && styles.navButtonDisabled]}
          onPress={() => setCurrentWeekStart(prev => navigateWeek(prev, "prev"))}
          disabled={isToday === 1}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        <View style={styles.weekDisplay}>
          <Text style={styles.weekText}>
            {isToday === 1 ? "Today" : getWeekDateRange(currentWeekStart)}
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.navButton, isToday === 1 && styles.navButtonDisabled]}
          onPress={() => setCurrentWeekStart(prev => navigateWeek(prev, "next"))}
          disabled={isToday === 1}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={handleSearchChange}
          placeholder="Search Staff by Name"
          placeholderTextColor={Colors.gray}
          style={GlobalStyles.searchInput}
        />
        <ModularButton onPress={handleReset} text="Reset" />
      </View>

      {/* Filter Container */}
      <View style={styles.filterContainer}>
        <RoleDropdown
          selectedRoleId={selectedRoleId}
          onRoleSelect={(value) => setSelectedRoleId(value as number)}
          placeholder="All Roles"
          labelText=""
          containerStyle={styles.dropdownButton}
        />
        <SectionDropdown
          selectedSectionId={selectedSectionId}
          onSectionSelect={(value) => setSelectedSectionId(value as number)}
          placeholder="All Sections"
          labelText=""
          containerStyle={styles.dropdownButton}
        />
        <ModularDropdown
          selectedValue={isToday}
          // Declare value being selected is a number
          onSelect={(value) => setIsToday(value as number)}
          labelText="Today:"
          containerStyle={styles.dropdownButton}
          options={isTodayOptions}
          usePlaceholder={false}
          editable={!loading}
        />
      </View>

      {loading && <LoadingCircle size="small" style={{ marginTop: 10, alignSelf: "center" }} />}

      {/* Schedule Spreadsheet */}
      <View style={{ flex: 1 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} keyboardShouldPersistTaps="handled">
          <View>
            {renderHeader()}
            <FlatList
              data={scheduleData}
              keyExtractor={(item) => item.employee_id.toString()}
              renderItem={({ item }) => renderEmployeeRow(item)}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: height * 0.7 }}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </ScrollView>
      </View>

      {/* Shift Modal - Add, Update, Delete */}
      <ShiftModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        shiftData={selectedShift}
        employeeData={selectedEmployee}
        date={selectedDate}
        onUpdate={() => setLocalRefresh((prev) => prev + 1)}
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
  navButtonDisabled: {
    backgroundColor: Colors.gray,
    opacity: 0.2,
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
    paddingVertical: 10,
    gap: 6,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 12,
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
  shiftCellDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.lightGray
  },
  shiftTextDisabled: {
    color: Colors.lightGray,
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