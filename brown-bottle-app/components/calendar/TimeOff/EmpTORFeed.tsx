import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Platform } from "react-native";

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import Card from '@/components/modular/Card';
import LoadingCircle from '@/components/modular/LoadingCircle';

import ModularButton from '@/components/modular/ModularButton';
import ModularListView from '@/components/modular/ModularListView';

import ModularDropdown from '@/components/modular/dropdown/ModularDropdown';
import { DropdownOption, DateSortType } from '@/types/iDropdown';

import TORListItem from '@/components/admin/TimeOff/Templates/TORListItem';
import EmpSubmitTOR from '@/components/calendar/TimeOff/EmpSubmitTOR';
import EmpTORModal from '@/components/calendar/TimeOff/EmpTORModal';

import { getTimeOffRequest } from '@/routes/time_off_request';
import { TimeOffRequest, Status, GetTimeOffRequest } from '@/types/iTimeOff';

import { useSession } from '@/utils/SessionContext';

interface Props {
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

const statusOptions: DropdownOption<string>[] = [
  { key: "Pending", value: "Pending" },
  { key: "Accepted", value: "Accepted" },
  { key: "Denied", value: "Denied" },
];

const dateDropdownOptions: DropdownOption<string>[] = [
  { key: "Newest Date", value: "Newest" },
  { key: "Oldest Date", value: "Oldest" }
];

const EmpTORFeed: React.FC<Props> = ({ parentRefresh, onRefreshDone }) => {
  const { width, height } = useWindowDimensions();
  const WIDTH = width;
  const HEIGHT = height;

  const isMobile = WIDTH < 768;
  const cardHeight = isMobile ? HEIGHT * 0.65 : HEIGHT * 0.7;

  const { user } = useSession();

  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);

  const [submitTORVisible, setSubmitTORVisible] = useState(false);
  const openSubmitTOR = () => {
    setSubmitTORVisible(true);
  };
  const closeSubmitTOR = () => {
    setSelectedRequest(null);
    setSubmitTORVisible(false);
  };


  const [torModalVisible, setTORModalVisible] = useState(false);
  const openTORModal = (request: TimeOffRequest) => {
    setSelectedRequest(request);
    setTORModalVisible(true);
  };
  const closeTORModal = () => {
    setTORModalVisible(false);
    setSelectedRequest(null);
  };

  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [dateFilter, setDateFilter] = useState<DateSortType>("Newest");

  const [localRefresh, setLocalRefresh] = useState(0);

  // Fetch time off requests
  const fetchTOR = useCallback(async () => {
    if (!user) return;

    try {
      setError(null);
      setLoading(true);

      const statuses: Status[] = [];

      if (statusFilter) {
        statuses.push(statusFilter as Status);
      }

      const params: Partial<GetTimeOffRequest> = {
        employee_id: user.employee_id,
        status: statuses,
        date_sort: dateFilter
      };

      const data = await getTimeOffRequest(params);

      setRequests(data);

    } catch (error: any) {
      setError('Failed to fetch time off requests!');
      console.log('Failed to fetch time off requests:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user, dateFilter, statusFilter]);

  // Fetch Time Off Requests Data on Initialization and State Update
  useEffect(() => {
    fetchTOR();
  }, [parentRefresh, localRefresh, fetchTOR]);

  // UI Rendering
  const renderTOR = (request: TimeOffRequest) => {
    return <TORListItem request={request} />
  };

  if (!user) {
    return (
      <Card style={{ height: cardHeight }}>
        <LoadingCircle size="small" />
      </Card>
    );
  }

  return (

    <Card style={{ height: cardHeight }}>

      {/* Header Row */}
      <View style={styles.headerContainer}>

        {/* Filter Container*/}
        <View style={styles.filterContainer}>
          {/* Status Filter */}
          <ModularDropdown
            data={statusOptions}
            selectedValue={statusFilter}
            onSelect={(value) => setStatusFilter(value as Status)}
            usePlaceholder={true}
            placeholderText="Any Status"
            containerStyle={GlobalStyles.dropdownButtonWrapper}
          />

          {/* Date Filter */}
          <ModularDropdown
            data={dateDropdownOptions}
            onSelect={(value) => setDateFilter(value as DateSortType)}
            selectedValue={dateFilter}
            usePlaceholder={false}
            containerStyle={GlobalStyles.dropdownButtonWrapper}
          />
        </View>

        {/* Action Container */}
        <View style={styles.actionContainer}>
          {/* Add Button */}
          <ModularButton
            text="Add"
            onPress={openSubmitTOR}
            style={styles.addButton}
            textStyle={{ color: Colors.purple }}
          />
        </View>
      </View>

      {/* Submit TOR Modal */}
      <EmpSubmitTOR
        visible={submitTORVisible}
        onClose={closeSubmitTOR}
        onSubmit={() => setLocalRefresh(prev => prev + 1)}
      />


      {/* Time Off Request Feed */}
      <ModularListView
        data={requests}
        loading={loading}
        error={error}
        emptyText="No requests found."
        itemContainerStyle={{ backgroundColor: "white" }}
        onItemPress={openTORModal}
        renderItem={renderTOR}
      />

      {/* Time Off Request Modal */}
      {selectedRequest && (
        <EmpTORModal
          visible={torModalVisible}
          request={selectedRequest}
          onClose={closeTORModal}
          onSubmit={() => setLocalRefresh(prev => prev + 1)}
        />
      )}


    </Card>

  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  actionContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 10,
    alignItems: "flex-start",
  },
  dropdownButton: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 200,
  },
  addButton: {
    flex: 1,
    minWidth: 200,
    backgroundColor: Colors.bgPurple,
    borderWidth: 1,
    borderColor: Colors.borderPurple,
  },
});

export default EmpTORFeed;
