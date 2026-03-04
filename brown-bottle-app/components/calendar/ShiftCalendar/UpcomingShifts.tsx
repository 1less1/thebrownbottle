import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import StatCard from '@/components/modular/StatCard';
import NextShiftSkeleton from '@/components/ui/skeleton/home/NextShiftSkeleton';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { getShift } from '@/routes/shift';
import { Shift } from '@/types/iShift';
import { formatDate, convertSQLDate, normalizeDateObject } from '@/utils/dateTimeHelpers';
import { useSession } from '@/utils/SessionContext';

interface UpcomingShiftsProps {
  parentRefresh?: number;
  showRole?: boolean;
  showSection?: boolean;
  limit?: number;
}

const UpcomingShifts: React.FC<UpcomingShiftsProps> = ({
  parentRefresh,
  showRole = true,
  showSection = true,
  limit = 3,
}) => {
  const { user } = useSession();

  const [loading, setLoading] = useState(true);
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);

  const fetchUpcomingShifts = useCallback(async () => {
    const employeeId = Number(user?.employee_id);
    if (!employeeId) {
      setUpcomingShifts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getShift({
        next_shift: 1,
        next_count: limit,
        employee_id: employeeId,
      });

      if (Array.isArray(data)) {
        setUpcomingShifts(data.slice(0, limit) as Shift[]);
      } else {
        setUpcomingShifts([]);
      }
    } catch (error: any) {
      console.log('Error fetching upcoming shifts:', error?.message || error);
      setUpcomingShifts([]);
    } finally {
      setLoading(false);
    }
  }, [limit, user?.employee_id]);

  useEffect(() => {
    fetchUpcomingShifts();
  }, [fetchUpcomingShifts, parentRefresh]);

  if (loading) return <NextShiftSkeleton />;

  if (!upcomingShifts.length) {
    return (
      <View>
        <Text style={GlobalStyles.floatingHeaderText}>Upcoming Shifts</Text>
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

  const today = normalizeDateObject(new Date()).getTime();

  return (
    <View>
      {upcomingShifts.map((shift) => {
        const isToday = convertSQLDate(shift.date).getTime() === today;

        const sectionText = showSection ? shift.section_name : '';
        const roleText = showRole && shift.primary_role_name ? shift.primary_role_name : '';
        const footerText = [sectionText, roleText].filter(Boolean).join(' • ');

        return (
          <View key={shift.shift_id} style={{ marginLeft: 8, marginRight: 8 }}>
            <StatCard
              title={formatDate(shift.date)}
              value={shift.start_time}
              iconName={isToday ? 'time' : 'calendar-outline'}
              backgroundColor={isToday ? Colors.bgYellow : "#fafafa"}
              iconColor={isToday ? Colors.pendingYellow : Colors.blue}
              borderColor={isToday ? Colors.borderYellow : "#d2d2d2"}
              iconContainerStyle={{
                backgroundColor: isToday ? Colors.bgIconYellow : Colors.disabledBlue,
              }}
              valueStyle={{ fontSize: 16 }}
              titleStyle={{ fontSize: 13 }}
              footerText={footerText}
              footerTextStyle={{ color: Colors.darkGray, fontSize: 14 }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default UpcomingShifts;
