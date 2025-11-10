import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { getTimeOffRequests } from '@/utils/api/time_off_request';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { useSession } from '@/utils/SessionContext';
import AcceptDenyButtons from './AcceptDenyButtons';
import { updateTimeOffStatus } from '@/utils/api/time_off_request';
import DefaultScrollView from '@/components/DefaultScrollView';
import { formatDateWithYear } from '@/utils/dateTimeHelpers';
import ModularListView from '@/components/modular/ModularListView';

import { formatDateTime } from '@/utils/dateTimeHelpers';

import { TimeOffRequest } from '@/types/iTimeOff';

type TabOption = 'active' | 'completed';

const AdminTimeOff: React.FC = () => {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState<TabOption>('active');
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests(); // whatever your fetch function is
    setRefreshing(false);
  };


  // Refresh on focus
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
    request_id: number,
    timestamp: string
  ): Promise<void> => {
    try {
      // console.log(`Approving request ${request_id} for ${employee_name} at ${req.timestamp}`);
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
  ): Promise<void> => {
    try {
      console.log(`Denying request ${request_id} for ${employee_name}`);
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

        {/* Content (modularized) */}
        <ModularListView
          data={currentList}
          loading={loading}
          error={error}
          maxHeight={350}
          renderItem={(req) => (
            <View key={req.request_id} style={styles.requestItem}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left side: Info */}
                <View style={{ flex: 1 }}>
                  <Text style={[GlobalStyles.boldText]}>{req.reason}</Text>
                  <Text style={styles.date}>
                    {formatDateWithYear(req.start_date)} → {formatDateWithYear(req.end_date)}
                  </Text>

                  <Text style={styles.employee}>
                    <Text>Requested by: </Text>
                    <Text style={{ fontWeight: 'bold' }}>
                      {req.first_name} {req.last_name}
                    </Text>
                  </Text>

                  <Text style={styles.timestamp}>
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
                    <View
                      style={[
                        styles.statusBadge,
                        req.status === 'Accepted'
                          ? GlobalStyles.accepted
                          : req.status === 'Denied'
                            ? GlobalStyles.denied
                            : styles.neutralBadge,
                      ]}
                    >
                      <Text style={styles.statusText}>{req.status}</Text>
                    </View>
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
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    maxWidth: '30%',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: Colors.gray,
    fontSize: 16,
  },
  requestItem: {
    backgroundColor: Colors.inputBG,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginBottom: 10,
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
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
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
    borderRadius: 8
  },

  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.black,
    textTransform: 'uppercase',
  },

});
