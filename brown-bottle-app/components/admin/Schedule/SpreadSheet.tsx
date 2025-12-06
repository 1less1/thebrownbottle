import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, ScrollView, FlatList, StyleSheet, useWindowDimensions, TouchableOpacity, Pressable, Alert } from "react-native";
import { debounce } from "lodash";

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import ModularDropdown from "@/components/modular/dropdown/ModularDropdown";
import ModularButton from "@/components/modular/ModularButton";
import LoadingCircle from "@/components/modular/LoadingCircle";
import ShiftModal from "@/components/admin/Schedule/ShiftModal";

import { CheckboxOption } from "@/types/iCheckbox";
import { yesNoDropdownOptions } from '@/types/iDropdown';

import { formatSQLDate, formatDateNoTZ } from "@/utils/dateTimeHelpers";
import { ScheduleEmployee, ScheduleShift } from "@/types/iShift";
import { getSchedule, getSunday, navigateWeek, getWeekStartEnd, getWeekRangeString, getWeekDayList } from "@/routes/schedule";
import { getTimeOffRequest } from "@/routes/time_off_request";
import { buildBlockedDaysMap, attachBlockedDays } from "@/routes/schedule";

import { exportToCSV, exportToPDF } from "@/utils/exportSchedule";

import RoleCheckbox from "@/components/modular/checkbox/RoleCheckbox";
import SectionCheckbox from "@/components/modular/checkbox/SectionCheckbox";
import { Status } from "@/types/iTimeOff";
import { DropdownOption } from '@/types/iDropdown';

interface SpreadSheetProps {
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

const isTodayOptions: DropdownOption<number>[] = [
  { key: "All Shifts", value: 0 },
  { key: "Today's Shifts", value: 1 },
];

const SpreadSheet: React.FC<SpreadSheetProps> = ({ parentRefresh }) => {
  const { width, height } = useWindowDimensions();
  const WIDTH = width;
  const HEIGHT = height;

  const [query, setQuery] = useState("");

  const [localRefresh, setLocalRefresh] = useState(0);
  const [loading, setLoading] = useState(false);

  const [scheduleData, setScheduleData] = useState<ScheduleEmployee[]>([]);

  const [selectedSections, setSelectedSections] = useState<CheckboxOption<number>[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<CheckboxOption<number>[]>([]);
  const [isToday, setIsToday] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ScheduleShift | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<ScheduleEmployee | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getSunday(new Date()));

  const fetchSchedule = async (searchTerm: string) => {
    setLoading(true);
    try {
      const { weekStartStr, weekEndStr } = getWeekStartEnd(currentWeekStart);

      const roleIds = selectedRoles.map(s => s.value); // Create array of roleIds --> [1, 2, 3]
      const sectionIds = selectedSections.map(s => s.value); // Create array of sectionIds --> [1, 2, 3]

      const params: Record<string, any> = {
        full_name: searchTerm.trim() ? `%${searchTerm.trim()}%` : undefined,
        is_today: isToday,
        role_id: roleIds.length > 0 ? roleIds : undefined,
        section_id: sectionIds.length > 0 ? sectionIds : undefined, // ✅ array
      };

      if (isToday === 0) {
        params.start_date = weekStartStr;
        params.end_date = weekEndStr;
      }

      const schedule: ScheduleEmployee[] = await getSchedule(params);

      // Fetch accepted time off requests
      const timeOff = await getTimeOffRequest({
        status: ["Accepted"],
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
    [selectedSections, selectedRoles, isToday, currentWeekStart]
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
    if (query != "" || selectedSections.length > 0 || selectedRoles.length > 0 || isToday != 0) {
      debouncedSearch.cancel();
      setQuery("");
      setSelectedRoles([]);
      setSelectedSections([]);
      setIsToday(0);
      setLocalRefresh((prev) => prev + 1);
    }
  };

  const handleThisWeekReset = () => {
    const sundayThisWeek = getSunday(new Date());
    if (currentWeekStart.getTime() !== sundayThisWeek.getTime()) {
      debouncedSearch.cancel();
      setLocalRefresh((prev) => prev + 1);
      setCurrentWeekStart(sundayThisWeek);
    }
  };

  // Fetch Schedule Data on Initialization and State Update
  useEffect(() => {
    triggerRefresh(query)
  }, [selectedSections, selectedRoles, isToday, currentWeekStart, parentRefresh, localRefresh]);

  // Layout Calculations
  const isMobile = WIDTH < 768;
  const NAME_COL_WIDTH = isMobile ? 160 : Math.max(160, WIDTH * 0.12);
  const weekDays = getWeekDayList(currentWeekStart, 7);
  const DAY_COL_WIDTH = isMobile ? 120 : Math.max(120, (WIDTH * 0.70) / weekDays.length);
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

  // Render Header Row with column names: "Employee", "Monday", "Tuesday"... "Friday"
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

  // Render Employee Rows based on each ScheduleEmployee Object parsed from the /schedule API route
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
                  <Text style={[GlobalStyles.semiBoldSmallText, isDisabled && styles.shiftTextDisabled]}>
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
          <Ionicons name="arrow-back-outline" size={20} color={Colors.black} />
        </TouchableOpacity>

        {/* Week Label */}
        <View style={styles.weekDisplay}>
          <Text style={GlobalStyles.boldMediumText}>
            {isToday === 1 ? "Today" : getWeekRangeString(currentWeekStart)}
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.navButton, isToday === 1 && styles.navButtonDisabled]}
          onPress={() => setCurrentWeekStart(prev => navigateWeek(prev, "next"))}
          disabled={isToday === 1}
        >
          <Ionicons name="arrow-forward-outline" size={20} color={Colors.black} />
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

        <ModularButton
          onPress={handleReset}
          onLongPress={() => Alert.alert("Hint", "Reset Search and All Filters")}
          text=""
          enabled={!loading}
          textStyle={{ marginRight: 4 }}
        >
          <Ionicons name="reload-outline" size={20} color={Colors.black} style={{ transform: [{ scaleX: -1 }] }}/>
        </ModularButton>

        <ModularButton
          onPress={handleThisWeekReset}
          onLongPress={() => Alert.alert("Hint", "Reset to Current Week")}
          style={{ backgroundColor: Colors.bgBlue }}
          text=""
          textStyle={{ marginRight: 4 }}
          enabled={!loading}
        >
          <Ionicons name="calendar-number-outline" size={20} color={Colors.black} />
        </ModularButton>


        <ModularButton
          onPress={() => exportToCSV(scheduleData, weekDays)}
          onLongPress={() => Alert.alert("Hint", "Export Current Schedule to Excel File")}
          style={{ backgroundColor: Colors.bgGreen }}
          text=""
          textStyle={{ marginRight: 4 }}
          enabled={!loading}
        >
          <Ionicons name="download-outline" size={20} color={Colors.black} />
        </ModularButton>


      </View>

      {/* Filter Container */}
      <View style={styles.filterContainer}>
        <RoleCheckbox
          selectedRoles={selectedRoles}
          onRoleSelect={(keys, values) => {
            setSelectedRoles(values.map((value, index) => ({
              key: keys[index],
              value: value,
            })));
          }}
          containerStyle={styles.dropdownButton}
        />
        <SectionCheckbox
          selectedSections={selectedSections}
          onSectionSelect={(keys, values) => {
            setSelectedSections(values.map((value, index) => ({
              key: keys[index],
              value: value,
            })));
          }}
          containerStyle={styles.dropdownButton}
        />
        <ModularDropdown
          data={isTodayOptions}
          selectedValue={isToday}
          onSelect={(value) => setIsToday(value as number)}
          containerStyle={styles.dropdownButton}
          usePlaceholder={false}
          disabled={loading}
        />
      </View>

      {loading && <LoadingCircle size={"small"} />}

      {/* Schedule Spreadsheet */}
      {/* Scroll View = Horizontal */}
      {/* Flat List = Vertical */}
      <View style={{ flex: 1 }}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            {renderHeader()}
            <FlatList
              data={scheduleData}
              keyExtractor={(item) => item.employee_id.toString()}
              renderItem={({ item }) => renderEmployeeRow(item)}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: HEIGHT * 0.7 }}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </ScrollView>
      </View>

      {/* Fallback */}
      {!loading && scheduleData.length === 0 && query.length > 0 && (
        <Text style={[GlobalStyles.text, { marginBottom: 10, textAlign: "center" }]}>
          No results found...
        </Text>
      )}

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
  weekDisplay: {
    flex: 1,
    alignItems: 'center',
  },

  // Search and Filter Containers
  searchContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
    gap: 6,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  dropdownButton: {
    flex: 1,
    flexShrink: 1,
    minWidth: 150,
  },

  // Schedule Grid
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.lightBorderColor,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderRightWidth: 5
  },
  headerRow: {
    backgroundColor: Colors.whiteGray,
    borderBottomWidth: 2,
    borderColor: Colors.borderColor,
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: Colors.gray,
    padding: 4,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 12,
    color: Colors.darkGray,
    textAlign: 'center',
  },

  // Employee Name Cell
  nameCell: {
    justifyContent: 'center',
    padding: 8,
    backgroundColor: Colors.whiteGray,
    borderRightWidth: 1,
    borderColor: Colors.lightBorderColor,
  },
  employeeName: {
    fontWeight: '600',
    fontSize: 14,
  },
  employeeRole: {
    fontSize: 13,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },

  // Shift Cells
  shiftCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: Colors.lightGray,
    padding: 4,
  },
  shiftContent: {
    alignItems: 'center',
  },
  shiftSection: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  noShift: {
    color: Colors.darkGray,
    fontSize: 14,
  },
  shiftCellHovered: {
    backgroundColor: Colors.lightGray,
    opacity: 0.6,
  },
  shiftCellDisabled: {
    opacity: 0.6,
    backgroundColor: Colors.lightGray
  },
  shiftTextDisabled: {
    color: Colors.lightGray,
  },
});

export default SpreadSheet;