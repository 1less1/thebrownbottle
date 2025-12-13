import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors } from "@/constants/Colors";
import CalendarModal from "@/components/calendar/CalendarModal";
import { useSession } from "@/utils/SessionContext";
import { Dimensions } from "react-native";
import { getShift } from "@/routes/shift";

import { Shift } from "@/types/iShift";

interface Props {
  visible: boolean;
  onClose: () => void;
  requireShiftSelection?: boolean;
  dateString: string; // formatted date string: YYYY-MM-DD
  onChange: (newDate: string) => void;
}

LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
LocaleConfig.defaultLocale = "en";

const CalendarWidget: React.FC<{
  mode?: "calendar" | "picker";
  requireShiftSelection?: boolean;
  showShifts?: boolean;
  onSelectDate?: (payload: { date: string; shift: Shift | null }) => void;
  initialDate?: string;
  onLoadingChange?: (loading: boolean) => void;
}> = ({
  mode = "calendar",
  requireShiftSelection = false,
  showShifts = true,
  onSelectDate,
  initialDate,
  onLoadingChange
}) => {


    const { user } = useSession();

    const [shifts, setShifts] = useState<Shift[]>([]);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const [selectedDate, setSelectedDate] = useState(
      initialDate || new Date().toISOString().split("T")[0]
    );

    const today = useMemo(
      () => new Date().toISOString().split("T")[0],
      []
    );

    /** ---- FETCH SHIFTS (ONLY IF ALLOWED) ---- */
    // Fetch Shifts on Initialization and State Update
    useEffect(() => {
      if (!showShifts || !user?.employee_id) {
        console.log("Exiting early: no user or shifts not enabled");
        return;
      }

      onLoadingChange?.(true);

      (async () => {
        try {
          const data = await getShift({ employee_id: user.employee_id });
          setShifts(data || []);
        } catch (err) {
          console.log("Fetch failed:", err);
        } finally {
          onLoadingChange?.(false);
        }
      })();
    }, [showShifts, user?.employee_id]);


    const markedDates = useMemo(() => {
      const map: Record<string, any> = {};

      // Mark shift days
      if (showShifts) {
        shifts.forEach((shift) => {
          const isPast = shift.date < today;
          const isPicker = mode === "picker";
          map[shift.date] = {
            selected: true,
            selectedColor:
            // Greyed out shifts in the past
              isPicker && isPast ? Colors.disabledBlue : Colors.borderBlue,
          };
        });
      }
      // Always show dot on today
      if (!map[today]) map[today] = {};
      map[today].marked = true;
      map[today].dotColor = "white";

      return map;
    }, [shifts, selectedDate, showShifts]);

    /** ---- HANDLE DAY PRESS ---- */
    const handleDayPress = (day: { dateString: string }) => {
      const isShiftDay = shifts.some((s) => s.date === day.dateString);

      // Only allow selecting dates that have shifts when enabled
      if (mode === "picker" && requireShiftSelection && !isShiftDay) {
        return;
      }

      setSelectedDate(day.dateString);

      if (mode === "picker") {
        const selectedShift = shifts.find(s => {
          const normalized = new Date(s.date).toISOString().split("T")[0];
          return normalized === day.dateString;
        });

        // return BOTH: the selected date and shift object if exists
        onSelectDate?.({
          date: day.dateString,
          shift: selectedShift || null
        });

        return;
      }

      const match = shifts.find((s) => s.date === day.dateString);
      setSelectedShift(match || null);
    };

    const screenWidth = Dimensions.get("window").width;
    const baseWidth = 380;
    const scale = Math.min(screenWidth / baseWidth, 1.1);


    return (
      <View style={styles.container}>
        <Calendar
          current={selectedDate}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          minDate={mode === "picker" ? today : undefined} // deactivate dates before today if on picker mode
          theme={{
            backgroundColor: Colors.white,
            calendarBackground: Colors.white,
            textSectionTitleColor: "black",
            selectedDayBackgroundColor: Colors.blue,
            selectedDayTextColor: Colors.white,
            todayTextColor: Colors.blue,
            dayTextColor: "black",
            arrowColor: Colors.blue,
            monthTextColor: Colors.blue,
            textDayFontWeight: "400",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "500",
            textDayFontSize: 12 * scale,
            textMonthFontSize: 16 * scale,
            textDayHeaderFontSize: 12 * scale,
          }}
        />

        {/* Only show shift modal when used as the schedule calendar */}
        {mode === "calendar" && selectedShift && (
          <CalendarModal
            visible
            date={selectedShift.date}
            startTime={selectedShift.start_time}
            role={selectedShift.primary_role_name}
            section={selectedShift.section_name}
            onClose={() => setSelectedShift(null)}
          />
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    width: "100%",
  }
});

export default CalendarWidget;
