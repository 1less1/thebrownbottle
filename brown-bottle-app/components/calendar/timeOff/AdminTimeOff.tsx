import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { getTimeOffRequests } from '@/routes/time_off_request';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { useSession } from '@/utils/SessionContext';
import AcceptDenyButtons from './AcceptDenyButtons';
import { updateTimeOffStatus } from '@/routes/time_off_request';
import DefaultScrollView from '@/components/DefaultScrollView';
import ModularListView from '@/components/modular/ModularListView';
import { formatDateWithYear, formatDateTime } from '@/utils/dateTimeHelpers';
import { TimeOffRequest } from '@/types/iTimeOff';
import StatusBadge from '@/components/modular/StatusBadge';

type TabOption = 'active' | 'completed';

const AdminTimeOff: React.FC = () => {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState<TabOption>('active');
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all requests
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data: TimeOffRequest[] = await getTimeOffRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching time off requests:', err);
      setError('Failed to fetch time off requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests])
  );

  // Separate into active and completed
  const pendingRequests = requests.filter((r) => r.status === 'Pending');
  const completedRequests = requests.filter((r) => r.status !== 'Pending');
  const currentList = activeTab === 'active' ? pendingRequests : completedRequests;

  // Handlers
  const handleApproveRequest = async (
    employee_id: number,
    employee_name: string,
    request_id: number
  ) => {
    try {
      await updateTimeOffStatus(request_id, 'Accepted');
      await fetchRequests();
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const handleDenyRequest = async (
    employee_id: number,
    employee_name: string,
    request_id: number
  ) => {
    try {
      await updateTimeOffStatus(request_id, 'Denied');
      await fetchRequests();
    } catch (err) {
      console.error('Error denying request:', err);
    }
  };

  return (
    <DefaultScrollView refreshing={refreshing} onRefresh={handleRefresh}>
      <View style={{ flex: 1, width: '100%' }}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          {(['active', 'completed'] as TabOption[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === 'active' ? 'Active Requests' : 'Completed Requests'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main List */}
        <ModularListView
          data={currentList}
          loading={loading}
          error={error}
          emptyText={
            activeTab === 'active'
              ? 'No active requests.'
              : 'No completed requests yet.'
          }
          renderItem={(req) => (
            <View key={req.request_id}>
              <View style={styles.headerRow}>
                {/* Left side: Info */}
                <View style={{ flex: 1 }}>
                  <Text style={[GlobalStyles.semiBoldText]}>{req.reason}</Text>
                  <Text style={[GlobalStyles.smallSemiBoldAltText, { marginTop: 4 }]}>
                    {formatDateWithYear(req.start_date)} →{' '}
                    {formatDateWithYear(req.end_date)}
                  </Text>

                  <Text style={[GlobalStyles.smallAltText, { marginTop: 4 }]}>
                    <Text>Requested by: </Text>
                    <Text style={{ fontWeight: 'bold' }}>
                      {req.first_name} {req.last_name}
                    </Text>
                  </Text>

                  <Text style={[GlobalStyles.smallAltText, { marginTop: 4, color: Colors.gray }]}>
                    Submitted at {formatDateTime(req.timestamp)}
                  </Text>
                </View>

                {/* Right side: Status / Buttons */}
                <View style={styles.buttonContainer}>
                  {req.status === 'Pending' ? (
                    <AcceptDenyButtons
                      employee_id={req.employee_id}
                      employee_name={`${req.first_name} ${req.last_name}`}
                      request_id={req.request_id}
                      status={req.status}
                      onApproveRequest={handleApproveRequest}
                      onDenyRequest={handleDenyRequest}
                    />
                  ) : (
                    <StatusBadge status={req.status} />
                  )}
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </DefaultScrollView>
  );
};

export default AdminTimeOff;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.black,
  },
  tabText: {
    color: Colors.gray,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: Colors.black,
  },
  date: {
    fontSize: 13,
    color: Colors.darkGray,
    marginTop: 4,
  },
  employee: {
    fontSize: 13,
    color: '#5d5858ff',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },
  neutralBadge: {
    backgroundColor: '#f0f0f0',
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
  },
});
