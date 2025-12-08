import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Platform } from "react-native";

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import Card from '@/components/modular/Card';
import LoadingCircle from '@/components/modular/LoadingCircle';

import ModularButton from '@/components/modular/ModularButton';
import ModularListView from '@/components/modular/ModularListView';
import StatusBadge from '@/components/modular/StatusBadge'

import SubmitTimeOff from '@/components/calendar/TimeOff/SubmitTimeOff';
import TimeOffDetails from '@/components/calendar/TimeOff/TimeOffDetails';

import ModularDropdown from '@/components/modular/dropdown/ModularDropdown';
import { ageDropdownOptions, DropdownOption } from '@/types/iDropdown';

import { TimeOffRequest, Status } from '@/types/iTimeOff';

import { formatDate, formatDateTime } from '@/utils/dateTimeHelpers';

import { useSession } from '@/utils/SessionContext';
import { getTimeOffRequest } from '@/routes/time_off_request';

interface EmpTimeOffProps {
  parentRefresh?: number;
  onRefreshDone?: () => void;
}

const statusOptions: DropdownOption<string>[] = [
  { key: "Pending", value: "Pending" },
  { key: "Accepted", value: "Accepted" },
  { key: "Denied", value: "Denied" },
];

const ageOptions = ageDropdownOptions;


const EmpTimeOff: React.FC<EmpTimeOffProps> = ({ parentRefresh, onRefreshDone }) => {
  const { width, height } = useWindowDimensions();
  const WIDTH = width;
  const HEIGHT = height;

  const PC_MAX_HEIGHT_FACTOR = 0.65;
  const MOBILE_MAX_HEIGHT_FACTOR = 0.45;

  const listMaxHeight = Platform.OS === 'web'
    ? HEIGHT * PC_MAX_HEIGHT_FACTOR  // Use a larger fraction of screen height for web
    : HEIGHT * MOBILE_MAX_HEIGHT_FACTOR; // Use a smaller fraction for mobile

  const { user } = useSession();

  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);
  const [submitTimeOffVisible, setSubmitTimeOffVisible] = useState(false);
  const [timeOffDetailsVisible, setTimeOffDetailsVisible] = useState(false);

  const toggleSubmitTimeOff = () => setSubmitTimeOffVisible((prev) => !prev);
  const toggleTimeOffDetails = () => setTimeOffDetailsVisible((prev) => !prev);

  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("Newest");

  const [localRefresh, setLocalRefresh] = useState(0);

  const fetchTOR = async () => {

    if (!user?.employee_id) return;

    try {

      setLoading(true);
      setError(null)

      const statuses: Status[] = [];

      if (statusFilter) {
        statuses.push(statusFilter as Status);
      }

      const params: Record<string, any> = {
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
    console.log("Refreshing")
  }, [user, parentRefresh, localRefresh, statusFilter, dateFilter]);

  if (!user) {
    return (
      <Card style={GlobalStyles.loadingContainer}>
        <LoadingCircle />
      </Card>
    );
  }

  return (

    <Card>

      {/* Header Row */}
      <View style={styles.headerContainer}>

        {/* Dropdown Filters */}
        <View style={styles.filterContainer}>
          <ModularDropdown
            data={statusOptions}
            selectedValue={statusFilter}
            onSelect={(value) => setStatusFilter(value as Status)}
            usePlaceholder={true}
            placeholderText="Any Status"
            containerStyle={styles.dropdownButton}
          />

          <ModularDropdown
            data={ageOptions}
            onSelect={(value) => setDateFilter(value as string)}
            selectedValue={dateFilter}
            usePlaceholder={false}
            containerStyle={styles.dropdownButton}
          />
        </View>


        <View style={styles.actionContainer}>
          <ModularButton
            text="Add"
            onPress={toggleSubmitTimeOff}
            style={{ flex: 1, minWidth: 200, backgroundColor: Colors.bgPurple, borderWidth: 1, borderColor: Colors.borderPurple }}
            textStyle={{ color: Colors.purple }}
          />
        </View>

      </View>


      <ModularListView
        data={requests}
        loading={loading}
        error={error}
        emptyText="No requests found."
        maxHeight={listMaxHeight}
        onItemPress={(req) => {
          setSelectedRequest(req);
          setTimeOffDetailsVisible(true);
        }}
        itemContainerStyle={{ backgroundColor: "white" }}
        renderItem={(req) => (
          <View style={styles.badgeView}>
            <View style={{ flex: 1, paddingRight: 8 }}>

              {/* Top Row */}
              <View style={styles.topRow}>
                <View style={styles.topLeftText}>
                  <Text style={GlobalStyles.semiBoldText}>
                    {req.start_date === req.end_date
                      ? formatDate(req.start_date)
                      : `${formatDate(req.start_date)} → ${formatDate(req.end_date)}`
                    }
                  </Text>
                </View>

                <View style={styles.badgeWrapper}>
                  <StatusBadge status={req.status as Status} />
                </View>
              </View>

              {/* Bottom Section */}
              <>
                <Text style={[GlobalStyles.smallAltText, { color: Colors.gray }]}>
                  Submitted on {formatDateTime(req.timestamp)}
                </Text>
              </>
            </View>
          </View>
        )}
      />



      <SubmitTimeOff
        visible={submitTimeOffVisible}
        onClose={toggleSubmitTimeOff}
        onSubmitted={() => setLocalRefresh(prev => prev + 1)}
      />

      <TimeOffDetails
        visible={timeOffDetailsVisible}
        request={selectedRequest}
        onClose={toggleTimeOffDetails}
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
    backgroundColor: Colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.altBorderColor,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  badgeView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  topLeftText: {
    flex: 1,
    paddingRight: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badgeWrapper: {
    flexShrink: 0,
    alignItems: "flex-end",
  },
});
