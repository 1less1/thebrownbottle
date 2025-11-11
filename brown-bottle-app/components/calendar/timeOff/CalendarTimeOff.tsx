import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TimeOffModal from './TimeOffModal';
import { Colors } from '@/constants/Colors';
import Card from '@/components/modular/Card';
import { useSession } from '@/utils/SessionContext';
import { getTimeOffRequests } from '@/routes/time_off_request';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { formatDate, formatDateTime } from '@/utils/dateTimeHelpers';
import ModularListView from '@/components/modular/ModularListView';
import { TimeOffRequest, TimeOffProps } from '@/types/iTimeOff';
import TimeOffFilter from "./TimeOffFilter";


const CalendarTimeOff: React.FC<TimeOffProps> = ({ refreshKey }) => {
  const { user } = useSession();
  const [modalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("All");


  const toggleModal = () => setModalVisible((prev) => !prev);

  const filteredRequests =
    filter === "All"
      ? requests
      : filter === "Pending"
        ? requests.filter((r) => r.status === "Pending")
        : requests.filter((r) => r.status === "Accepted" || r.status === "Denied");


  const fetchUserRequests = async () => {
    if (!user?.employee_id) return;

    try {
      setLoading(true);
      const myRequests: TimeOffRequest[] = await getTimeOffRequests({
        employee_id: user.employee_id,
      });

      const sorted = myRequests.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      setRequests(sorted);
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
    <Card>
      {/* Header Row */}

      <View style={styles.row}>
        <View style={styles.rowRight}>
          <TimeOffFilter
            selectedFilter={filter}
            onChange={(val) => setFilter(val)}
          />

          <TouchableOpacity onPress={toggleModal}>
            <View style={styles.addButton}>
              <Text style={styles.addText}>Add</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>


      {/* Main List */}
      <ModularListView
        data={filteredRequests}
        loading={loading}
        error={error}
        emptyText={`No ${filter === "All" ? "" : filter.toLowerCase()} requests found.`}
        renderItem={(req) => (
          <>
            <View style={styles.rowBetween}>
              <Text style={styles.date}>
                {formatDate(req.start_date)} {'–'} {formatDate(req.end_date)}
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

            <Text
              style={[GlobalStyles.boldMediumText, { marginTop: 4, color: Colors.gray }]}
            >
              {req.reason}
            </Text>

            <Text style={styles.timestamp}>
              Submitted at {formatDateTime(req.timestamp)}
            </Text>
          </>
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
    color: Colors.black,
  },
  addButton: {
    backgroundColor: Colors.white,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10, // adds spacing between dropdown and Add button
  },
  date: {
    fontSize: 16,
    flexWrap: 'wrap',
    color: Colors.black,
    fontWeight: 'bold',
    maxWidth: '55%',
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
});
