import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

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

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await getUserShifts(employee_id);
        setShifts(data);
      } catch (error) {
        console.error('Error fetching user shifts:', error);
      } finally {
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
        <Text style={styles.altText}>Loading next shift...</Text>
      </Card>
    );
  }

  if (!nextShift) {
    return (
      <Card style={styles.container}>
        <Text style={styles.altText}>No Upcoming Shift...</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <AltCard style={styles.shiftCard}>
        <Text style={styles.dateText}>Date: {nextShift.date}</Text>
        <Text style={styles.text}>
          Time: {nextShift.start_time} - {nextShift.end_time}
        </Text>
        <Text style={styles.text}>Section: {nextShift.section_name}</Text>
      </AltCard>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  text: {
    fontSize: 14,
    color: Colors.black,
  },
  altText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.gray,
  },
});

export default NextShift;
