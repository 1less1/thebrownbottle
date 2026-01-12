import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, useWindowDimensions, Platform } from "react-native";

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import Card from "@/components/modular/Card";
import LoadingCircle from "@/components/modular/LoadingCircle";

import ModularListView from "@/components/modular/ModularListView";

import ModularDropdown from "@/components/modular/dropdown/ModularDropdown";
import { DropdownOption, DateSortType } from "@/types/iDropdown";
import RoleDropdown from "@/components/modular/dropdown/RoleDropdown";

import SCRListItem from "@/components/admin/ShiftCover/Templates/SCRListItem";
import AdmSCRModal from "@/components/admin/ShiftCover/AdmSCRModal";

import { getShiftCoverRequest } from "@/routes/shift_cover_request";
import { GetShiftCoverRequest, ShiftCoverRequest, Status } from "@/types/iShiftCover";


import { useSession } from "@/utils/SessionContext";

interface Props {
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

const AdmSCRFeed: React.FC<Props> = ({ parentRefresh, onRefreshDone }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const isMobile = WIDTH < 768;
    const cardHeight = isMobile ? HEIGHT * 0.68 : HEIGHT * 0.7;

    const { user } = useSession();

    const [requests, setRequests] = useState<ShiftCoverRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [localRefresh, setLocalRefresh] = useState(0);

    const [selectedRequest, setSelectedRequest] = useState<ShiftCoverRequest | null>(null);

    const [scrModalVisible, setSCRModalVisible] = useState(false);
    const toggleSCRModal = () => setSCRModalVisible((prev) => !prev);

    const [dateFilter, setDateFilter] = useState<DateSortType>("Newest");
    const [statusFilter, setStatusFilter] = useState<Status | null>(null);
    const [roleFilter, setRoleFilter] = useState<number | null>(null);

    const [activeTab, setActiveTab] = useState<"Active" | "Completed">("Active");

    // Fetch shift cover requests
    const fetchSCR = useCallback(async () => {
        if (!user) return;

        try {
            setError(null);
            setLoading(true);

            const statuses: Status[] = [];

            if (activeTab === 'Active') {
                statuses.push("Awaiting Approval" as Status)
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

            const params: Partial<GetShiftCoverRequest> = {
                status: statuses,
                date_sort: dateFilter,
            };

            if (roleFilter) {
                params.requested_primary_role = roleFilter;
                params.requested_secondary_role = roleFilter;
                params.requested_tertiary_role = roleFilter;
            }

            const data = await getShiftCoverRequest(params);

            setRequests(data);

        } catch (error: any) {
            setError('Failed to fetch shift cover requests!');
            console.log('Failed to fetch shift cover requests:', error.message);
        } finally {
            setLoading(false);
        }
    }, [user, activeTab, roleFilter, dateFilter, statusFilter]);

    // Fetch shift cover requests on initialiaztion and state update
    useEffect(() => {
        fetchSCR();
    }, [parentRefresh, localRefresh, fetchSCR]);

    // UI Rendering
    const handlePress = (request: ShiftCoverRequest) => {
        setSelectedRequest(request);
        toggleSCRModal();
    };

    const renderTask = (request: ShiftCoverRequest) => {
        return <SCRListItem request={request} />
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

            {/* Filter Container*/}
            <View style={styles.filterContainer}>
                {/* Role Filter */}
                <RoleDropdown
                    onRoleSelect={(value) => setRoleFilter(value as number)}
                    selectedRole={roleFilter}
                    usePlaceholder={true}
                    placeholderText="All Roles"
                    containerStyle={styles.dropdownButton}
                    disabled={loading}
                />

                {/* Status Filter */}
                <ModularDropdown
                    data={statusOptions}
                    selectedValue={statusFilter}
                    onSelect={(value) => setStatusFilter(value as Status)}
                    usePlaceholder={true}
                    placeholderText="Any Status"
                    containerStyle={styles.dropdownButton}
                    disabled={loading || activeTab == "Active"}
                />

                {/* Date Filter */}
                <ModularDropdown
                    data={dateDropdownOptions}
                    onSelect={(value) => setDateFilter(value as DateSortType)}
                    selectedValue={dateFilter}
                    usePlaceholder={false}
                    containerStyle={styles.dropdownButton}
                    disabled={loading}
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


            {/* Shift Cover Request Feed */}
            <ModularListView
                data={requests}
                loading={loading}
                error={error}
                emptyText="No requests found."
                itemContainerStyle={{ backgroundColor: "white" }}
                onItemPress={handlePress}
                renderItem={renderTask}
            />

            {/* Shift Cover Request Modal */}
            {selectedRequest && (
                <AdmSCRModal
                    visible={scrModalVisible}
                    request={selectedRequest}
                    onClose={toggleSCRModal}
                    onSubmit={() => setLocalRefresh(prev => prev + 1)}
                />
            )}

        </Card>

    );
};

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

export default AdmSCRFeed;
