import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, useWindowDimensions, Platform } from "react-native";

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import LoadingCircle from "@/components/modular/LoadingCircle";

import ModularButton from "@/components/modular/ModularButton";
import ModularListView from "@/components/modular/ModularListView";

import ModularDropdown from "@/components/modular/dropdown/ModularDropdown";
import { DropdownOption, DateSortType } from "@/types/iDropdown";
import RoleDropdown from "@/components/modular/dropdown/RoleDropdown";

import ListItemDetails from "@/components/calendar/TimeOff/Templates/ListItemDetails";
import TimeOffModal from "@/components/admin/Dashboard/TimeOff/TimeOffModal";

import { getTimeOffRequest } from "@/routes/time_off_request";
import { GetTimeOffRequest, TimeOffRequest, Status } from "@/types/iTimeOff";


import { useSession } from "@/utils/SessionContext";

interface AdminTimeOffProps {
    parentRefresh?: number;
    onRefreshDone?: () => void;
}

const statusOptions: DropdownOption<string>[] = [
    { key: "Accepted", value: "Accepted" },
    { key: "Denied", value: "Denied" },
];

const dateDropdownOptions: DropdownOption<string>[] = [
    { key: "Newest Date", value: "Newest" },
    { key: "Oldest Date", value: "Oldest" }
];

const AdminTimeOff: React.FC<AdminTimeOffProps> = ({ parentRefresh, onRefreshDone }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const PC_MAX_HEIGHT_FACTOR = 0.58;
    const MOBILE_MAX_HEIGHT_FACTOR = 0.4;

    const listMaxHeight = Platform.OS === 'web'
        ? HEIGHT * PC_MAX_HEIGHT_FACTOR  // Use a larger fraction of screen height for web
        : HEIGHT * MOBILE_MAX_HEIGHT_FACTOR; // Use a smaller fraction for mobile

    const { user } = useSession();

    const [requests, setRequests] = useState<TimeOffRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);
    const [shiftCoverModalVisible, setTimeOffModalVisible] = useState(false);

    const toggleTimeOffModal = () => setTimeOffModalVisible((prev) => !prev);

    const [dateFilter, setDateFilter] = useState<DateSortType>("Newest");
    const [statusFilter, setStatusFilter] = useState<Status | null>(null);
    const [roleFilter, setRoleFilter] = useState<number | null>(null);

    const [activeTab, setActiveTab] = useState<"Active" | "Completed">("Active");

    const [localRefresh, setLocalRefresh] = useState(0);

    // Fetch Time Off Requests
    const fetchTOR = async () => {

        if (!user?.employee_id) return;

        setLoading(true);
        setError(null);

        try {

            const statuses: Status[] = [];

            if (activeTab === 'Active') {
                statuses.push("Pending" as Status)
            }

            if (activeTab === "Completed") {
                if (statusFilter) {
                    statuses.push(statusFilter as Status);
                }
                else {
                    statuses.push("Accepted" as Status)
                    statuses.push("Denied" as Status)
                }
            }

            const params: Partial<GetTimeOffRequest> = {
                status: statuses,
                date_sort: dateFilter
            };

            if (roleFilter) {
                params.primary_role = roleFilter;
                params.secondary_role = roleFilter;
                params.tertiary_role = roleFilter;
            }

            const data = await getTimeOffRequest(params);

            setRequests(data);

        } catch (error) {
            setError('Failed to fetch time off requests.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Time Off Requests on Initialization and State Update
    useEffect(() => {
        fetchTOR();
        console.log("Refreshing")
    }, [user, parentRefresh, localRefresh, activeTab, roleFilter, dateFilter, statusFilter]);


    if (!user) {
        return (
            <Card style={GlobalStyles.loadingContainer}>
                <LoadingCircle />
            </Card>
        );
    }

    return (

        <Card>

            {/* Filter Container*/}
            <View style={styles.filterContainer}>

                {/* Role Filter */}
                <RoleDropdown
                    onRoleSelect={(value) => setRoleFilter(value as number)}
                    selectedRole={roleFilter}
                    usePlaceholder={true}
                    placeholderText="All Roles"
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
                    disabled={activeTab == "Active"}
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

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {(["Active", "Completed"] as const).map((tab) => (
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
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>


            {/* Time Off Request Feed */}
            <ModularListView
                data={requests}
                loading={loading}
                error={error}
                emptyText="No requests available."
                maxHeight={listMaxHeight}
                itemContainerStyle={{ backgroundColor: "white" }}
                onItemPress={(req) => {
                    setSelectedRequest(req);
                    toggleTimeOffModal();
                }}
                renderItem={(req) => (
                    <ListItemDetails request={req} />
                )}
            />


            <TimeOffModal
                visible={shiftCoverModalVisible}
                request={selectedRequest}
                onClose={toggleTimeOffModal}
                onSubmitted={() => setLocalRefresh(prev => prev + 1)}
            />

        </Card>

    );
};

export default AdminTimeOff;

const styles = StyleSheet.create({
    // Filters
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

    // Tabs
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
});

