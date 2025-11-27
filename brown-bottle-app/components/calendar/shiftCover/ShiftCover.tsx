import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import Card from "@/components/modular/Card";
import { useSession } from "@/utils/SessionContext";
import { GlobalStyles } from "@/constants/GlobalStyles";
import ModularListView from "@/components/modular/ModularListView";
import ModularButton from "@/components/modular/ModularButton";
import ShiftCoverModal from "./ShiftCoverModal";
import ShiftDetailsModal from "./ShiftDetailsModal";
import LoadingCircle from "@/components/modular/LoadingCircle";

import { formatDateTime, formatTime, formatShiftDate } from "@/utils/dateTimeHelpers";
import { getShiftCoverRequest } from "@/routes/shift_cover_requests";
import { ShiftCoverRequest } from "@/types/iShiftCover";
import { ShiftCoverFilters } from "./ShiftCoverFilters";
import RoleDropdown from "@/components/modular/RoleDropdown";
import ModularDropdown from "@/components/modular/ModularDropdown";

const ShiftCover: React.FC<{ refreshKey: number }> = ({ refreshKey }) => {
    const { user } = useSession();
    const [requests, setRequests] = useState<ShiftCoverRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ShiftCoverRequest | null>(null);

    const toggleModal = () => setModalVisible((prev) => !prev);

    // ---- Filtering ----
    type OwnershipType = "My Requests" | "Available";

    type StatusType =
        | "all"
        | "Pending"
        | "Accepted"
        | "Denied";

    const ownershipOptions = [
        { key: "My Requests", label: "My Requests" },
        { key: "Available", label: "Available" },
    ];

    const statusOptions = [
        { key: "all", label: "All" },
        { key: "Pending", label: "Pending" },
        { key: "Accepted", label: "Accepted" },
        { key: "Denied", label: "Denied" },
    ];

    const [ownershipFilter, setOwnershipFilter] = useState<"My Requests" | "Available">("Available");
    const [statusFilter, setStatusFilter] = useState<"all" | "Pending" | "Accepted" | "Denied">("all");
    const [roleFilter, setRoleFilter] = useState<number | null>(null);

    const disabledDropdownStyle = {
        opacity: 0.5,
    };

    // Fetch
    const fetchRequests = async () => {
        if (!user?.employee_id) return;
        setLoading(true);
        setError(null);

        try {
            const params: Record<string, any> = {};

            // Include role filter if selected
            if (roleFilter !== null) {
                params.requester_role_id = roleFilter;
            }

            // When viewing "My Requests," use the OR logic
            if (ownershipFilter === 'My Requests') {
                params.employee_id = user.employee_id;
                if (statusFilter !== 'all') {
                    params.status = statusFilter;
                }
            }

            // When viewing "Available," request only pending and optionally filter by requester role
            if (ownershipFilter === 'Available') {
                params.status = 'Pending';
                if (roleFilter != null) {
                    params.requester_role_id = roleFilter;
                }
            }

            const data = await getShiftCoverRequest(params);
            const normalised = data.map(req => ({
                ...req,
                requested_employee_id: Number(req.requested_employee_id),
                accepted_employee_id: req.accepted_employee_id
                    ? Number(req.accepted_employee_id)
                    : null,
            }));
            setRequests(normalised);
        } catch (err) {
            setError('Failed to fetch shift cover requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user, refreshKey, ownershipFilter, statusFilter, roleFilter]);

    useEffect(() => {
        if (ownershipFilter !== "My Requests") {
            setStatusFilter("all");
        }
    }, [ownershipFilter]);

    useEffect(() => {
        if (ownershipFilter !== "Available") {
            setRoleFilter(null);
        }
    }, [ownershipFilter]);


    if (!user) {
        return (
            <Card style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                <LoadingCircle />
            </Card>
        );
    }

    return (
        <Card>
            <ModularButton
                text="Add Request"
                onPress={toggleModal}
                style={styles.shiftCoverButton}
            />

            <View style={styles.headerRow}>
                {/* Filter Modal */}
                <View style={{ flexGrow: 0.5, paddingRight: 5 }} >
                    <ModularDropdown
                        labelText=""
                        selectedValue={ownershipFilter}
                        usePlaceholder={false}
                        options={ownershipOptions.map(opt => ({ key: opt.label, value: opt.key }))}
                        onSelect={(value) => setOwnershipFilter(value as OwnershipType)}
                    />
                </View>

                <View style={{ minWidth: '20%', paddingRight: 5,flexGrow: 0.25 }}>
                    <ModularDropdown
                        labelText=""
                        selectedValue={statusFilter}
                        usePlaceholder={false}
                        editable={ownershipFilter === "My Requests"}
                        buttonStyle={ownershipFilter !== 'My Requests' ? disabledDropdownStyle : undefined}
                        options={statusOptions.map(opt => ({ key: opt.label, value: opt.key }))}
                        onSelect={(value) => setStatusFilter(value as StatusType)}
                    />
                </View>
                {/* Allways enabled, allows filtering by user role */}
                <View style={{ flexGrow: 0.4, }}>
                    <RoleDropdown
                        selectedRoleId={roleFilter}
                        onRoleSelect={(value) => setRoleFilter(value as number)}
                        placeholder="All Roles"
                        labelText=""
                    />
                </View>
            </View>

            <ModularListView
                data={requests}
                loading={loading}
                error={error}
                emptyText={
                    ownershipFilter === "My Requests"
                        ? "No requests available."
                        : "No available shifts right now."
                }
                renderItem={(req) => (
                    <Pressable
                        onPress={() => {
                            setSelectedRequest(req);
                            setDetailModalVisible(true);
                        }}
                        style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
                    >
                        {req.status !== 'Pending' &&
                            req.accepted_first_name &&
                            req.accepted_last_name && (
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#535353ff', fontWeight: 'bold' }}>
                                        {req.accepted_first_name} {req.accepted_last_name}
                                    </Text>
                                    <Text style={{ color: '#535353ff' }}> is requesting</Text>
                                </View>
                            )}

                        <View style={styles.rowBetween}>
                            <Text style={styles.date}>
                                {formatShiftDate(req.shift_date)} {formatTime(req.shift_start)}
                            </Text>

                            <Text
                                style={[
                                    styles.statusText,
                                    req.status === "Accepted"
                                        ? GlobalStyles.accepted
                                        : req.status === "Denied"
                                            ? GlobalStyles.denied
                                            : req.status === "Awaiting Approval"
                                                ? GlobalStyles.awaitingApproval
                                                : GlobalStyles.pending,
                                ]}
                            >
                                {req.status}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ color: "#535353ff" }}>From: </Text>
                                <Text
                                    style={[styles.nameText]}
                                >
                                    {req.requested_first_name} {req.requested_last_name} { }
                                </Text>
                            </View>
                            <Text>
                                ({req.requester_role_name})
                            </Text>
                        </View>
                        <Text style={{ color: "#535353ff" }}>Section: {req.section_name}</Text>
                        {/* <Text style={styles.timestamp}>
                            Submitted on {formatDateTime(req.timestamp)}
                        </Text> */}
                    </Pressable>
                )}
            />

            <ShiftCoverModal
                visible={modalVisible}
                onClose={toggleModal}
                requests={requests}
                onSubmitted={fetchRequests}
            />

            <ShiftDetailsModal
                visible={detailModalVisible}
                request={selectedRequest}
                onSubmitted={fetchRequests}
                onClose={() => setDetailModalVisible(false)}
            />
        </Card>
    );
};

export default ShiftCover;

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
    },
    shiftCoverButton: {
        backgroundColor: Colors.white,
        borderColor: Colors.altBorderColor,
        borderWidth: 1,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    date: {
        fontSize: 15,
        flexWrap: "wrap",
        color: Colors.black,
        fontWeight: "bold",
        maxWidth: "60%",
    },
    nameText: {
        fontWeight: 'bold',
        color: '#535353ff'
    },
    statusText: {
        fontSize: 13,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    timestamp: {
        fontSize: 12,
        color: Colors.gray,
        marginTop: 4,
    },
});

