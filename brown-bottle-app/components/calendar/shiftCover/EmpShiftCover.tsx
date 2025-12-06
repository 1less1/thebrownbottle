import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from "react-native";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import LoadingCircle from "@/components/modular/LoadingCircle";

import ModularButton from "@/components/modular/ModularButton";
import ModularListView from "@/components/modular/ModularListView";
import StatusBadge from "@/components/modular/StatusBadge";

import ModularDropdown from "@/components/modular/dropdown/ModularDropdown";
import { DropdownOption } from "@/types/iDropdown";

import SubmitShiftCover from "@/components/calendar/ShiftCover/SubmitShiftCover";
import ShiftDetails from "@/components/calendar/ShiftCover/ShiftDetails";

import { getShiftCoverRequest } from "@/routes/shift_cover_request";
import { GetShiftCoverRequest, ShiftCoverRequest, Status } from "@/types/iShiftCover";

import { formatDateTime, formatTime, formatShiftDate } from "@/utils/dateTimeHelpers";

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

const dateDropdownOptions = [
    { key: "Newest Date", value: "Newest" },
    { key: "Oldest Date", value: "Oldest" }
];

const EmpShiftCover: React.FC<EmpShiftCoverProps>  = ({ parentRefresh, onRefreshDone }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

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
    const [dateFilter, setDateFilter] = useState<string>("Newest");
    const [statusFilter, setStatusFilter] = useState<Status | null>(null);
    //const [roleFilter, setRoleFilter] = useState<number | null>(null);

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

            const params: Partial<Record<string, any>> = {
                //requester_role_id: roleFilter,
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
    }, [user, parentRefresh, requestType, dateFilter, statusFilter]);


    if (!user) {
        return (
            <Card style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                <LoadingCircle />
            </Card>
        );
    }

    return (

        <Card>

            {/* New Request Button */}
            <ModularButton
                text="New Request"
                onPress={toggleSubmitShiftCover}
                style={GlobalStyles.modernButton}
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
                    onSelect={(value) => setDateFilter(value as string)}
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
                        ? "No requests available."
                        : "No available shifts right now."
                }
                listHeight={HEIGHT * 0.4}
                renderItem={(req) => (
                    <Pressable
                        onPress={() => {
                            setSelectedRequest(req);
                            setShiftDetailsModalVisible(true);
                        }}
                        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                    >

                        <View style={styles.badgeView}>

                            <View style={{ flex: 1, paddingRight: 8 }}>


                                <View style={styles.topRow}>
                                    <View style={styles.topLeftText}>
                                        {/* "Employee is requesting" line */}
                                        {req.status !== 'Pending' && req.accepted_first_name && req.accepted_last_name ? (
                                            <>
                                                <Text style={[GlobalStyles.boldAltText, { color: Colors.blue }]}>
                                                    {req.accepted_first_name} {req.accepted_last_name}{" "}
                                                </Text>
                                                <Text style={GlobalStyles.altText}>requesting...</Text>
                                            </>
                                        ) : (
                                            <Text style={GlobalStyles.semiBoldAltText}>
                                                Shift Available
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.badgeWrapper}>
                                        <StatusBadge status={req.status as Status} />
                                    </View>
                                </View>

                                {/* Bottom Section (Free Flowing Text) */}
                                <>
                                    {/* Shift Details */}
                                    <Text style={GlobalStyles.semiBoldText}>
                                        {formatShiftDate(req.shift_date)} {"@"} {formatTime(req.shift_start)}
                                    </Text>
                                    {/* <Text style={GlobalStyles.altText}>Section: {req.section_name}</Text> */}

                                    {/* Original Shift Assigmnent */}
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 2 }}>
                                        <Text style={GlobalStyles.text}>From: </Text>
                                        <Text
                                            style={[GlobalStyles.boldText, { color: Colors.brown }]}
                                        >
                                            {req.requested_first_name} {req.requested_last_name} { }
                                        </Text>
                                        <Text>
                                            ({req.requester_role_name})
                                        </Text>
                                    </View>

                                    {/* TimeStamp */}
                                    <Text style={[GlobalStyles.smallAltText, { color: Colors.gray, marginTop: 2 }]}>
                                        Submitted on {formatDateTime(req.timestamp)}
                                    </Text>
                                </>

                            </View>

                        </View>

                    </Pressable>
                )}
            />


            <ShiftDetails
                visible={shiftDetailsModalVisible}
                request={selectedRequest}
                onSubmitted={fetchSCR}
                onClose={() => setShiftDetailsModalVisible(false)}
            />

        </Card>

    );
};

export default EmpShiftCover;

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        flexWrap: "wrap",        // allow wrapping
        justifyContent: "space-between",
        gap: 10,                 // spacing between items
        marginVertical: 10,
    },
    dropdownButton: { 
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 200,
    },
    newRequestButton: {
        backgroundColor: Colors.white,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.altBorderColor,
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
        marginBottom: 2
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

