import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from "@/components/modular/Card";
import AltCard from '@/components/modular/AltCard';

import { getUserShifts } from '@/utils/api/shift';
import { Shift }  from '@/types/api'

interface Props {
  employee_id: number;
}

const NextShift: React.FC<Props> = ({ employee_id }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await getUserShifts(employee_id);
        setShifts(data);
      } catch (error) {
        console.error('Error fetching user shifts:', error);
        setError(true);
      } finally {
        console.log('Successfully fetched user shifts!')
        setLoading(false);
      }
    };

    fetchShifts();
  }, [employee_id]);

  const now = new Date();

  const nextShift = shifts
    .map((shift) => {
      const [month, day, year] = shift.date.split('/');
      const [hour, minute] = shift.start_time.split(':');

      const shiftDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );

      return { ...shift, shiftDateTime };
    })
    .filter((shift) => shift.shiftDateTime && shift.shiftDateTime > now)
    .sort((a, b) => a.shiftDateTime!.getTime() - b.shiftDateTime!.getTime())[0];

  
  if (loading) {
    return (
      <Card style={styles.container}>
        <Text style={GlobalStyles.loadingText}>Loading next shift...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={styles.container}>
        <Text style={GlobalStyles.errorText}>Unable fetch next shift!</Text>
      </Card>
    );
  }

  if (!nextShift) {
    return (
      <Card style={styles.container}>
        <Text style={GlobalStyles.loadingText}>No upcoming shifts...</Text>
      </Card>
    );
  }

  return (

    <Card style={styles.container}>
      <AltCard style={styles.shiftCard}>
        <Text style={GlobalStyles.headerText}>Date: {nextShift.date}</Text>
        <Text style={[GlobalStyles.text, { marginVertical: 5}]}>
          Time: {nextShift.start_time} - {nextShift.end_time}
        </Text>
        <Text style={GlobalStyles.altText}>Section: {nextShift.section_name}</Text>
      </AltCard>
    </Card>

  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  shiftCard: {
    width: '100%',
    backgroundColor: Colors.lightTan,
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 6,
  },
});

export default NextShift;
