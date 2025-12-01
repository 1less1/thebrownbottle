import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { useSession } from '@/utils/SessionContext';
import DefaultScrollView from '@/components/DefaultScrollView';
import ModularListView from '@/components/modular/ModularListView';
import { formatShiftDate, formatDateTime } from '@/utils/dateTimeHelpers';
import { ShiftCoverButtons } from './ShiftCoverButtons';
import { ShiftCoverRequest } from '@/types/iShiftCover';
import { getShiftCoverRequest } from '@/routes/shift_cover_request';
import { useConfirm } from "@/hooks/useConfirm";
import { updateShiftCoverRequest } from '@/routes/shift_cover_request';
import { approveShiftCoverRequest } from '@/routes/shift_cover_request';


type TabOption = 'active' | 'completed';

const ShiftCoverView: React.FC = () => {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState<TabOption>('active');
  const [requests, setRequests] = useState<ShiftCoverRequest[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { confirm } = useConfirm();


  // Fetch all requests
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data: ShiftCoverRequest[] = await getShiftCoverRequest();
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

  const activeRequests = requests.filter(
    (r) => r.status === "Awaiting Approval"
  );

  const completedRequests = requests.filter(
    (r) => r.status === "Accepted" || r.status === "Denied"
  );

  const currentList = activeTab === "active" ? activeRequests : completedRequests;

  const getRequestById = (id: number) => {
    const req = requests.find(r => r.cover_request_id === id);

    if (!req) {
      console.warn(`Request not found for ID: ${id}`);
      return null;
    }

    return req;
  };

  // Handlers
  const handleApproveRequest = async (request_id: number) => {
    const ok = await confirm("Approve Request", "Approve this shift?");
    if (!ok) return;

    try {
      setProcessingId(request_id);
      await approveShiftCoverRequest(request_id);
      await fetchRequests();
    } catch (error) {
      alert("Something went wrong approving this request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDenyRequest = async (request_id: number) => {
    const request = getRequestById(request_id);
    const ok = await confirm(
      'Deny Request',
      `Deny Shift Cover for ${request?.accepted_first_name} ${request?.accepted_last_name}?`
    );
    if (!ok) return;
    try {
      setProcessingId(request_id); 

      await updateShiftCoverRequest( request_id, {
        status: "Denied",
        accepted_employee_id: request?.accepted_employee_id ?? null 
      });

      await fetchRequests(); 
    } catch (err) {
      console.error("Error denying request:", err);
      alert("Something went wrong denying this request. Try again.");
    } finally {
      setProcessingId(null);
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
          maxHeight={350}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          emptyText={
            activeTab === 'active'
              ? 'No active requests.'
              : 'No completed requests yet.'
          }
          renderItem={(req) => (
            <View key={req.cover_request_id}>
              <View style={styles.headerRow}>
                {/* Left side: Info */}
                <View style={{ flex: 1 }}>
                  <Text style={[GlobalStyles.boldText]}>{req.accepted_first_name} {req.accepted_last_name} is Requesting</Text>
                  <Text style={styles.date}>
                    {formatShiftDate(req.shift_date)}
                  </Text>

                  <Text style={styles.employee}>
                    <Text>From: </Text>
                    <Text style={{ fontWeight: 'bold' }}>
                      {req.requested_first_name} {req.requested_last_name}
                    </Text>
                  </Text>

                  <Text style={styles.timestamp}>
                    Submitted at {formatDateTime(req.timestamp)}
                  </Text>
                </View>

                {/* Right side: Status / Buttons */}
                <View style={styles.buttonContainer}>
                  {req.status === 'Awaiting Approval' ? (
                    <ShiftCoverButtons
                      request_id={req.cover_request_id}
                      onApprove={handleApproveRequest}
                      onDeny={handleDenyRequest}
                      disabled={processingId === req.cover_request_id}
                    />

                  ) : (
                    <View
                      style={[
                        styles.statusBadge,
                        req.status === 'Accepted'
                          ? GlobalStyles.acceptedBadge
                          : req.status === 'Denied'
                            ? GlobalStyles.deniedBadge
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

export default ShiftCoverView;

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
    color: Colors.black,
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
