import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { formatDate, convertSQLDate, normalizeDateObject } from '@/utils/dateTimeHelpers';

import StatCard from '../modular/StatCard';
import { getShift } from '@/routes/shift';
import { Shift } from '@/types/iShift';
import NextShiftSkeleton from '../ui/skeleton/home/NextShiftSkeleton';

import { useSession } from '@/utils/SessionContext';

interface Props {
  showRole?: boolean;
  showSection?: boolean;
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

const NextShift: React.FC<Props> = ({
  showRole = true,
  showSection = true,
  parentRefresh,
  onRefreshDone
}) => {

  const [loading, setLoading] = useState(true);
  const [nextShift, setNextShift] = useState<Shift | null>(null);

  const { user } = useSession();

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const fetchNextShift = useCallback(async () => {
    const employeeId = Number(user?.employee_id);
    if (!employeeId) return;

    setLoading(true);
    await delay(500);

    try {
      const data = await getShift({
        next_shift: 1,
        employee_id: employeeId,
      });

      if (Array.isArray(data) && data.length > 0) {
        setNextShift(data[0] as Shift);
      } else {
        setNextShift(null);
      }
    } catch (error: any) {
      console.log("Error fetching next shift:", error.message);
      setNextShift(null);
    } finally {
      setLoading(false);
    }
  }, [user?.employee_id]);


  // Initialization and state update
  useEffect(() => {
    fetchNextShift();
  }, [parentRefresh, fetchNextShift]);


  if (loading) return <NextShiftSkeleton />;

  // NO Upcoming Shift
  if (!nextShift) {
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

  // Date comparison
  const apiDate = convertSQLDate(nextShift.date);
  const today = normalizeDateObject(new Date());
  const isToday = apiDate.getTime() === today.getTime();


  // Shift Today
  if (isToday) {
    return (
      <View>
        <Text style={GlobalStyles.floatingHeaderText}>Shift Today</Text>
        <StatCard
          title={formatDate(nextShift.date)}
          value={nextShift.start_time}
          iconName="time"
          backgroundColor={Colors.bgYellow}
          iconColor={Colors.pendingYellow}
          borderColor={Colors.borderYellow}
          iconContainerStyle={{ backgroundColor: Colors.bgIconYellow }}
          valueStyle={{ fontWeight: "600", fontSize: 17 }}
          titleStyle={{ fontSize: 15 }}
          footerText={`${showSection ? nextShift.section_name : ""} ${showRole && nextShift.primary_role_name
            ? `• ${nextShift.primary_role_name}`
            : ""
            }`}
          footerTextStyle={{ color: Colors.darkGray, fontSize: 14 }}
        />
      </View>
    );
  }

  // Upcoming Shift
  return (
    <View>
      <Text style={GlobalStyles.floatingHeaderText}>Your Next Shift</Text>
      <StatCard
        title={formatDate(nextShift.date)}
        value={nextShift.start_time}
        iconName="calendar-outline"
        backgroundColor={Colors.bgGray}
        iconColor={Colors.darkGray}
        borderColor={Colors.borderColor}
        iconContainerStyle={{ backgroundColor: Colors.bgIconGray }}
        valueStyle={{ fontSize: 18 }}
        titleStyle={{ fontSize: 15 }}
        footerText={`${showSection ? nextShift.section_name : ""} ${showRole && nextShift.primary_role_name
          ? `• ${nextShift.primary_role_name}`
          : ""
          }`}
        footerTextStyle={{ color: Colors.darkGray, fontSize: 14 }}
      />
    </View>


  );
};

export default NextShift;
