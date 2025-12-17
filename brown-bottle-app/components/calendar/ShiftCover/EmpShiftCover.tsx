import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Platform } from "react-native";

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import LoadingCircle from "@/components/modular/LoadingCircle";

import ModularButton from "@/components/modular/ModularButton";
import ModularListView from "@/components/modular/ModularListView";

import ModularDropdown from "@/components/modular/dropdown/ModularDropdown";
import { DropdownOption, DateSortType } from "@/types/iDropdown";

import ListItemDetails from "@/components/calendar/ShiftCover/Templates/ListItemDetails";
import SubmitShiftCover from "@/components/calendar/ShiftCover/SubmitShiftCover";
import ShiftDetails from "@/components/calendar/ShiftCover/ShiftDetails";

import { getShiftCoverRequest } from "@/routes/shift_cover_request";
import { ShiftCoverRequest, Status, GetShiftCoverRequest } from "@/types/iShiftCover";

import { useSession } from "@/utils/SessionContext";

interface EmpShiftCoverProps {
    parentRefresh?: number;
    onRefreshDone?: () => void;
}

const requestTypeOptions: DropdownOption<string>[] = [
    { key: "Available", value: "Available" },
    { key: "My Requests", value: "My Requests" },
];

const statusOptions: DropdownOption<string>[] = [
    { key: "Pending", value: "Pending" },
    { key: "Awaiting Approval", value: "Awaiting Approval" },
    { key: "Accepted", value: "Accepted" },
    { key: "Denied", value: "Denied" },
];

const dateDropdownOptions: DropdownOption<string>[] = [
    { key: "Newest Date", value: "Newest" },
    { key: "Oldest Date", value: "Oldest" }
];

const EmpShiftCover: React.FC<EmpShiftCoverProps> = ({ parentRefresh, onRefreshDone }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const isMobile = WIDTH < 768;
    const cardHeight = isMobile ? height * 0.65 : height * 0.7;

    const { user } = useSession();

    const [requests, setRequests] = useState<ShiftCoverRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedRequest, setSelectedRequest] = useState<ShiftCoverRequest | null>(null);
    const [shiftCoverModalVisible, setSubmitShiftCoverVisible] = useState(false);
    const [shiftDetailsModalVisible, setShiftDetailsModalVisible] = useState(false);

    const toggleSubmitShiftCover = () => setSubmitShiftCoverVisible((prev) => !prev);
    const toggleShiftDetailsModal = () => setShiftDetailsModalVisible((prev) => !prev);

    const [requestType, setRequestType] = useState<string>("Available");
    const [dateFilter, setDateFilter] = useState<DateSortType>("Newest");
    const [statusFilter, setStatusFilter] = useState<Status | null>(null);

    const [localRefresh, setLocalRefresh] = useState(0);

    // Fetch Shift Cover Requests
    const fetchSCR = async () => {

        if (!user?.employee_id) return;

        setLoading(true);
        setError(null);

        try {

            const statuses: Status[] = [];

            if (requestType === 'Available') {
                statuses.push("Pending" as Status)
            }

            if (requestType === "My Requests" && statusFilter) {
                statuses.push(statusFilter as Status);
            }

            const params: Partial<GetShiftCoverRequest> = {
                status: statuses,
                date_sort: dateFilter,
            };

            if (requestType === 'My Requests') {
                params.employee_id = user.employee_id;
            }

            const data = await getShiftCoverRequest(params);

            setRequests(data);

        } catch (error) {
            setError('Failed to fetch shift cover requests.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Shift Cover Requests on Initialization and State Update
    useEffect(() => {
        fetchSCR();
        console.log("Refreshing")
    }, [user, parentRefresh, localRefresh, requestType, dateFilter, statusFilter]);


    if (!user) {
        return (
            <Card style={GlobalStyles.loadingContainer}>
                <LoadingCircle />
            </Card>
        );
    }

    return (

        <Card style={{ height: cardHeight }}>

            {/* New Request Button */}
            <ModularButton
                text="New Request"
                onPress={toggleSubmitShiftCover}
                style={styles.newRequestButton}
                textStyle={{ color: Colors.blue }}
            />

            <SubmitShiftCover
                visible={shiftCoverModalVisible}
                onClose={toggleSubmitShiftCover}
                onSubmitted={fetchSCR}
            />


            {/* Filter Container*/}
            <View style={styles.filterContainer}>
                {/* Request Type Filter */}
                <ModularDropdown
                    data={requestTypeOptions}
                    onSelect={(value) => setRequestType(value as string)}
                    selectedValue={requestType}
                    usePlaceholder={false}
                    containerStyle={styles.dropdownButton}
                />

                {/* Status Filter */}
                <ModularDropdown
                    data={statusOptions}
                    selectedValue={statusFilter}
                    onSelect={(value) => setStatusFilter(value as Status)}
                    usePlaceholder={true}
                    placeholderText="Any Status"
                    containerStyle={styles.dropdownButton}
                    disabled={requestType != "My Requests"}
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


            {/* Shift Cover Request Feed */}
            <ModularListView
                data={requests}
                loading={loading}
                error={error}
                emptyText={
                    requestType === "My Requests"
                        ? "No requests found."
                        : "No available shifts right now."
                }
                maxHeight={HEIGHT * 0.625}
                itemContainerStyle={{ backgroundColor: "white" }}
                onItemPress={(req) => {
                    setSelectedRequest(req);
                    toggleShiftDetailsModal();
                }}
                renderItem={(req) => (
                    <ListItemDetails request={req} />
                )}
            />


            <ShiftDetails
                visible={shiftDetailsModalVisible}
                request={selectedRequest}
                onClose={toggleShiftDetailsModal}
                onSubmitted={() => setLocalRefresh(prev => prev + 1)}
            />

        </Card>

    );
};

export default EmpShiftCover;

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10, 
        marginVertical: 10,
    },
    dropdownButton: {
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 200,
    },
    newRequestButton: {
        backgroundColor: Colors.bgBlue,
        borderWidth: 1,
        borderColor: Colors.borderBlue,
    },
});

