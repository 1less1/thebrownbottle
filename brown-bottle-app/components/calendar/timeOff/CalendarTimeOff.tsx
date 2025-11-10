import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import TimeOffModal from './TimeOffModal';
import { Colors } from '@/constants/Colors';
import Card from '@/components/modular/Card';
import { useSession } from '@/utils/SessionContext';
import { getTimeOffRequests } from '@/utils/api/time_off_request';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { formatDate } from '@/utils/dateTimeHelpers';
import ModularListView from '@/components/modular/ModularListView';

import { formatDateTime } from '@/utils/dateTimeHelpers';

import { TimeOffRequest } from '@/types/iTimeOff';
import { TimeOffProps } from '@/types/iTimeOff';



const CalendarTimeOff: React.FC<TimeOffProps> = ({ refreshKey }) => {
  const { user } = useSession();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toggleModal = () => setModalVisible(!modalVisible);


  const fetchUserRequests = async () => {
    if (!user?.employee_id) return;

    try {
      setLoading(true);

      // Fetch only this employee’s requests (filtered at the backend)
      const myRequests: TimeOffRequest[] = await getTimeOffRequests({
        employee_id: user.employee_id,
      });

      // Sort so pending requests appear first, then by timestamp (descending)
      const sortedRequests = myRequests.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      setRequests(sortedRequests);
      setError(null);
    } catch (err) {
      console.error('Error fetching time off requests:', err);
      setError('Failed to fetch your time off requests.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUserRequests();
  }, [user, refreshKey]);

  if (!user) {
    return (
      <Card style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
        <Text style={{ color: Colors.gray, fontStyle: 'italic' }}>
          Loading user data...
        </Text>
      </Card>
    );
  }
  return (

    <Card style={{ paddingVertical: 10, paddingHorizontal: 20, shadowColor: '#000', }}>
      {/* Header Row */}
      <View style={styles.row}>
        <Text style={styles.header}></Text>

        {/* Add Button */}
        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.addButton}>
            <Text style={styles.addText}>Add</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ModularListView
        data={requests}
        loading={loading}
        error={error}
        renderItem={(req) => (
          <View key={req.request_id} style={styles.requestItem}>
            {/* Top Row: Date + Status (aligned left/right) */}
            <View style={styles.rowBetween}>
              <Text style={styles.date}>
                {formatDate(req.start_date)} {'\u00A0'}–{'\u200B'} {formatDate(req.end_date)}
              </Text>

              <Text
                style={[
                  styles.statusText,
                  req.status === 'Accepted'
                    ? GlobalStyles.accepted
                    : req.status === 'Denied'
                      ? GlobalStyles.denied
                      : GlobalStyles.pending,
                ]}
              >
                {req.status}
              </Text>

            </View>

            {/* Bottom Row: Reason */}
            <Text style={[GlobalStyles.boldMediumText, { marginTop: 4, color: Colors.gray }]}>
              {req.reason}
            </Text>

            <Text style={styles.timestamp}>
              Submitted at {formatDateTime(req.timestamp)}
            </Text>
          </View>
        )}
      />

      <TimeOffModal
        visible={modalVisible}
        onClose={toggleModal}
        onSubmitted={fetchUserRequests}
      />
    </Card>
  );
};

export default CalendarTimeOff;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: 'italic',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: Colors.white,
    padding: 0,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  addText: {
    color: Colors.black,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
  },
  requestItem: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.borderColor,
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    flexWrap: 'wrap',
    color: Colors.black,
    fontWeight: 'bold',
    maxWidth: '55%',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
