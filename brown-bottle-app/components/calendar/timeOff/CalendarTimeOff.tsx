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
import StatusBadge from '@/components/modular/StatusBadge';

import LoadingCircle from '@/components/modular/LoadingCircle';
import ModularDropdown from '@/components/modular/ModularDropdown';
import ModularButton from '@/components/modular/ModularButton';

const CalendarTimeOff: React.FC<TimeOffProps> = ({ refreshKey }) => {
  const { user } = useSession();
  const [modalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const toggleModal = () => setModalVisible((prev) => !prev);
  type FilterValue = typeof filterOptions[number]["key"];

  const [filter, setFilter] = useState<FilterValue>("All");
  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((r) => r.status === filter);

  const filterOptions = [
    { key: "All", label: "All" },
    { key: "Pending", label: "Pending" },
    { key: "Denied", label: "Denied" },
    { key: "Accepted", label: "Accepted" },
  ];


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
        <LoadingCircle />
      </Card>
    );
  }

  return (
    <Card>
      {/* Header Row */}

      <View style={styles.headerRow}>
        <View style={{}}>
          <ModularDropdown
            labelText=""
            selectedValue={filter}
            containerStyle={styles.dropdownButton}
            onSelect={(value) => setFilter(value as FilterValue)}
            usePlaceholder={false}
            options={filterOptions.map(opt => ({
              key: opt.label,  // what the user sees
              value: opt.key,  // what gets passed back to setFilter
            }))}
          />
        </View>
        {/* <TouchableOpacity onPress={toggleModal}>
          <View style={styles.addButton}>
            <Text style={GlobalStyles.boldText}>Add</Text>
          </View>
        </TouchableOpacity> */}
        <ModularButton
          text="Add"
          onPress={toggleModal}
          style={styles.addButton}
        />
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
              <Text style={GlobalStyles.semiBoldText}>
                {formatDate(req.start_date)} {'–'} {formatDate(req.end_date)}
              </Text>
              <StatusBadge status={req.status} />
            </View>

            <Text
              style={[GlobalStyles.altText, { marginTop: 4 }]}
            >
              {req.reason}
            </Text>

            <Text style={[GlobalStyles.smallAltText, { marginTop: 4, color: Colors.gray }]}>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 💡 this does the alignment
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  addText: {
    color: Colors.black,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    flexWrap: 'wrap',
    color: Colors.black,
    fontWeight: 'bold',
    maxWidth: '55%',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  dropdownButton: {
    minWidth: 110,
    alignSelf: "flex-start",
  },
});
