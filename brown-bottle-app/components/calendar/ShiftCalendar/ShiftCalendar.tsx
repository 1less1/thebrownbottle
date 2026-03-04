import React from "react";
import { View, useWindowDimensions } from "react-native";
import UpcomingShifts from "./UpcomingShifts";

import DefaultScrollView from "@/components/DefaultScrollView";
import Calendar from "@/components/calendar/Calendar";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useShiftRefresh } from "@/utils/ShiftRefreshContext";

const ShiftCalendar = () => {
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 900;

  const { refreshTrigger } = useShiftRefresh();

  return (
    <DefaultScrollView scrollEnabled={true}>
      <View
        style={[
          GlobalStyles.contentRow,
          isLargeScreen ? GlobalStyles.rowLayout : GlobalStyles.columnLayout,
          { width: "90%", marginTop: 16 },
        ]}
      >
        <View
          style={[
            GlobalStyles.calendarContainer,
            isLargeScreen ? GlobalStyles.calendarLarge : GlobalStyles.calendarSmall,
          ]}
        >
          <Calendar parentRefresh={refreshTrigger} />
        </View>

        <View
          style={[
            GlobalStyles.upcomingContainer,
            isLargeScreen ? GlobalStyles.upcomingLarge : GlobalStyles.upcomingSmall,
          ]}
        >
          <UpcomingShifts parentRefresh={refreshTrigger} />
        </View>
      </View>
    </DefaultScrollView>
  );
};

export default ShiftCalendar;
