import React, { useState, useEffect } from 'react';
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

import ListItemDetails from '@/components/calendar/TimeOff/Templates/ListItemDetails';
import SubmitTimeOff from '@/components/calendar/TimeOff/SubmitTimeOff';
import TORInfo from '@/components/calendar/TimeOff/TORInfo';

import { getTimeOffRequest } from '@/routes/time_off_request';
import { TimeOffRequest, Status, GetTimeOffRequest } from '@/types/iTimeOff';

import { useSession } from '@/utils/SessionContext';

interface EmpTimeOffProps {
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

const EmpTimeOff: React.FC<EmpTimeOffProps> = ({ parentRefresh, onRefreshDone }) => {
  const { width, height } = useWindowDimensions();
  const WIDTH = width;
  const HEIGHT = height;

  const isMobile = WIDTH < 768;
  const cardHeight = isMobile ? height * 0.65 : height * 0.7;

  const { user } = useSession();

  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);
  const [submitTimeOffVisible, setSubmitTimeOffVisible] = useState(false);
  const [timeOffDetailsVisible, setTORInfoVisible] = useState(false);

  const toggleSubmitTimeOff = () => setSubmitTimeOffVisible((prev) => !prev);
  const toggleTORInfo = () => setTORInfoVisible((prev) => !prev);

  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [dateFilter, setDateFilter] = useState<DateSortType>("Newest");

  const [localRefresh, setLocalRefresh] = useState(0);

  // Fetch Time Off Requests
  const fetchTOR = async () => {

    if (!user?.employee_id) return;

    try {

      setLoading(true);
      setError(null)

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

    } catch (error) {
      setError('Failed to fetch time off requests.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Time Off Requests Data on Initialization and State Update
  useEffect(() => {
    fetchTOR();
  }, [user, parentRefresh, localRefresh, statusFilter, dateFilter]);

  if (!user) {
    return (
      <Card style={GlobalStyles.loadingContainer}>
        <LoadingCircle />
      </Card>
    );
  }

  return (

    <Card style={{ height: cardHeight }}>

      {/* Header Row */}
      <View style={styles.headerContainer}>

        {/* Dropdown Filters */}
        <View style={styles.filterContainer}>
          {/* Status Filter */}
          <ModularDropdown
            data={statusOptions}
            selectedValue={statusFilter}
            onSelect={(value) => setStatusFilter(value as Status)}
            usePlaceholder={true}
            placeholderText="Any Status"
            containerStyle={styles.dropdownButton}
          />

          {/* Date Filter */}
          <ModularDropdown
            data={dateDropdownOptions}
            onSelect={(value) => setDateFilter(value as DateSortType)}
            selectedValue={dateFilter}
            usePlaceholder={false}
            containerStyle={styles.dropdownButton}
          />
        </View>


        <View style={styles.actionContainer}>
          <ModularButton
            text="Add"
            onPress={toggleSubmitTimeOff}
            style={styles.addButton}
            textStyle={{ color: Colors.purple }}
          />
        </View>

      </View>

      <SubmitTimeOff
        visible={submitTimeOffVisible}
        onClose={toggleSubmitTimeOff}
        onSubmitted={() => setLocalRefresh(prev => prev + 1)}
      />


      <ModularListView
        data={requests}
        loading={loading}
        error={error}
        emptyText="No requests found."
        maxHeight={HEIGHT * 0.625}
        onItemPress={(req) => {
          setSelectedRequest(req);
          toggleTORInfo();
        }}
        itemContainerStyle={{ backgroundColor: "white" }}
        renderItem={(req) => (
          <ListItemDetails request={req} />
        )}
      />


      <TORInfo
        visible={timeOffDetailsVisible}
        request={selectedRequest}
        onClose={toggleTORInfo}
        onSubmitted={() => setLocalRefresh(prev => prev + 1)}
      />

    </Card>

  );
};

export default EmpTimeOff;

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
