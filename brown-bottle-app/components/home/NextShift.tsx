import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { to24HourFormat } from '@/utils/dateTimeHelpers';

import StatCard from '../modular/StatCard';
import { getShift } from '@/routes/shift';
import { Shift } from '@/types/iShift';
import NextShiftSkeleton from '../ui/skeleton/home/NextShiftSkeleton';

interface Props {
  employee_id: number;
  showRole?: boolean;
  showSection?: boolean;
}

/**
 * Default Shift Length (NO stored end_time)
 */
const SHIFT_LENGTH_HOURS = 6;

/**
 * Helper to compute temporary end time
 * (Adds 6 hours to start time for NOW)
 */
const addHours = (date: Date, hours: number) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

const NextShift: React.FC<Props> = ({ employee_id, showRole = true, showSection = true }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await getShift({ employee_id });
        setShifts(data);
      } catch {
        setShifts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [employee_id]);

  const now = new Date();

  /**
   * PROCESS SHIFT DATE + ADD TEMP END TIME
   * - Convert backend AM/PM → 24h
   * - Construct ISO Date → Required for Mobile (iOS/Android)
   * - Add temporary 4 hr end time
   */
  const nextOrCurrentShift = shifts
    .map((shift) => {
      const time24 = to24HourFormat(shift.start_time);
      const start = new Date(`${shift.date}T${time24}:00`); // ISO string for mobile
      const end = addHours(start, SHIFT_LENGTH_HOURS);      // Temporary end

      return { ...shift, start, end };
    })
    /**
     * Keep ONLY shifts that are either:
     * - CURRENT (start <= now < end)
     * - FUTURE (start > now)
     */
    .filter((shift) => shift.end > now)
    /**
     * Sort so current shift appears first,
     * OR future next soonest shift
     */
    .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

  const isCurrentShift =
    nextOrCurrentShift && nextOrCurrentShift.start <= now && nextOrCurrentShift.end > now;

  // Loading visual
  if (loading) {
    return <NextShiftSkeleton />
  }

  //  No shifts upcoming OR current
  if (!nextOrCurrentShift) {
    return (
      <View>
        <Text style={GlobalStyles.floatingHeaderText}>Your Next Shift</Text>
        <StatCard
          title="No Upcoming Shifts"
          value="You're all caught up!"
          iconName="calendar-clear-outline"
          backgroundColor={Colors.bgGray}
          iconColor={Colors.darkGray}
          borderColor={Colors.borderColor}
          iconContainerStyle={{ backgroundColor: Colors.bgIconGray }}
          titleStyle={GlobalStyles.semiBoldLargeText}
          valueStyle={GlobalStyles.altText}
        />
      </View>
    );
  }

  //  If CURRENTLY working (within temporary 6 hr window)
  if (isCurrentShift) {
    const dateDisplay = nextOrCurrentShift.start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    return (
      <View>
        <Text style={GlobalStyles.floatingHeaderText}>Current Shift</Text>
        <StatCard

          title={dateDisplay}
          value={`${nextOrCurrentShift.start_time} - Active Now`}
          iconName="time"
          backgroundColor={Colors.bgYellow}
          iconColor={Colors.pendingYellow}
          borderColor={Colors.borderYellow}
          iconContainerStyle={{ backgroundColor: Colors.bgIconYellow }}
          valueStyle={{ fontWeight: "600", fontSize: 17 }}
          titleStyle={{ fontSize: 15 }}
          footerText={`${showSection ? nextOrCurrentShift.section_name : ''} ${showRole && nextOrCurrentShift.primary_role_name
            ? `• ${nextOrCurrentShift.primary_role_name}`
            : ''
            }`}
          footerTextStyle={{ color: "#4c4e4f", fontSize: 14 }}
        />
      </View>
    );
  }

  //  NEXT upcoming shift
  const dateDisplay = nextOrCurrentShift.start.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const timeDisplay = nextOrCurrentShift.start_time;

  return (
    <View>
      <Text style={GlobalStyles.floatingHeaderText}>Your Next Shift</Text>
      <StatCard
        title={dateDisplay} // Top row
        value={`${timeDisplay}`} // Middle row
        iconName="calendar-outline"
        backgroundColor={Colors.bgGray}
        iconColor={Colors.darkGray}
        borderColor={Colors.borderColor}
        iconContainerStyle={{ backgroundColor: Colors.bgIconGray }}
        valueStyle={{ fontSize: 18 }}
        titleStyle={{ fontSize: 15 }}
        footerText={`${showSection ? nextOrCurrentShift.section_name : ''} ${showRole && nextOrCurrentShift.primary_role_name
          ? `• ${nextOrCurrentShift.primary_role_name}`
          : ''
          }`}
        footerTextStyle={{ color: "#6c6e70", fontSize: 14 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
});

export default NextShift;
