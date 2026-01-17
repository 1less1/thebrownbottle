import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, useWindowDimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from '@/components/modular/Card';
import LoadingCircle from '@/components/modular/LoadingCircle';

import ModularDropdown from '@/components/modular/dropdown/ModularDropdown';
import RoleDropdown from '@/components/modular/dropdown/RoleDropdown';

import ModularListView from "@/components/modular/ModularListView";
import AnncListItem from '@/components/admin/Announcements/Templates/AnncListItem';

import AdmAckModal from '@/components/admin/Announcements/AdmAckModal';

import { getAnnouncement, deleteAnnouncement } from '@/routes/announcement';
import { Announcement, GetAnnouncement } from '@/types/iAnnouncement';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from "@/utils/SessionContext";
import { DropdownOption, DateSortType } from "@/types/iDropdown";

const dateDropdownOptions: DropdownOption<string>[] = [
    { key: "Newest Date", value: "Newest" },
    { key: "Oldest Date", value: "Oldest" }
];

interface Props {
    parentRefresh?: number;
    onRefreshDone?: () => void;
}

const AdmAnncFeed: React.FC<Props> = ({ parentRefresh, onRefreshDone }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const isMobile = WIDTH < 768;
    const cardHeight = isMobile ? HEIGHT * 0.50 : HEIGHT * 0.6;

    const { user } = useSession();
    const { confirm } = useConfirm();

    const [localRefresh, setLocalRefresh] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [selectedAnnouncementId, setSelectedAnnounceId] = useState<number | null>(null);

    const [ackModalVisible, setAckModalVisible] = useState(false);

    const [roleFilter, setRoleFilter] = useState<number | null>(null);
    const [timestampFilter, setTimestampFilter] = useState<DateSortType>("Newest");

    const openAckModal = (announcement_id: number) => {
        setSelectedAnnounceId(announcement_id);
        setAckModalVisible(true);
    };

    const closeAckModal = () => {
        setAckModalVisible(false);
        setSelectedAnnounceId(null);
    };

    const fetchAnnouncements = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);

            const params: Partial<GetAnnouncement> = {
                role_id: roleFilter as number,
                timestamp_sort: timestampFilter,
            };
            const data = await getAnnouncement(params);
            setAnnouncements(data);

        } catch (error: any) {
            setError('Failed to fetch announcements.');
            console.log('Failed to fetch announcements', error.message);
        } finally {
            setLoading(false);
        }
    }, [roleFilter, timestampFilter]);

    // Fetch announcements on initialization and state update
    useEffect(() => {
        fetchAnnouncements();
    }, [parentRefresh, localRefresh, fetchAnnouncements]);


    const handleDelete = async (announcementId: number) => {
        if (!user) return;

        // Confirmation Popup
        const ok = await confirm("Confirm Deletion", "Are you sure you want to delete this announcement?");
        if (!ok) return;

        setLoading(true);

        try {
            await deleteAnnouncement(announcementId);
            setLocalRefresh((prev) => prev + 1); // Trigger Refresh
        } catch (error: any) {
            console.log("Error deleting announcement:" + error.message);
        } finally {
            setLoading(false);
        }
    }

    const actionButtons = (announcement: Announcement) => {
        return (
            <View style={styles.buttonRow}>
                {/* Ack Button */}
                <TouchableOpacity
                    style={[styles.ackButton]}
                    onPress={() => openAckModal(announcement.announcement_id)}
                    disabled={loading}
                >
                    <Ionicons name="eye" size={20} color={Colors.blue} />
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                    style={[GlobalStyles.deleteButton, styles.deleteButton]}
                    onPress={() => handleDelete(announcement.announcement_id)}
                    disabled={loading}
                >
                    <Ionicons name="close-circle-outline" size={20} color={Colors.red} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderAnnouncement = (announcement: Announcement) => {
        return (
            <AnncListItem announcement={announcement}>
                {actionButtons(announcement)}
            </AnncListItem>
        );
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
                <RoleDropdown
                    selectedRole={roleFilter}
                    onRoleSelect={(value) => setRoleFilter(value as number)}
                    usePlaceholder={true}
                    placeholderText="All Roles"
                    containerStyle={GlobalStyles.dropdownButtonWrapper}
                    disabled={loading}
                />

                <ModularDropdown
                    data={dateDropdownOptions}
                    onSelect={(value) => setTimestampFilter(value as DateSortType)}
                    selectedValue={timestampFilter}
                    usePlaceholder={false}
                    containerStyle={GlobalStyles.dropdownButtonWrapper}
                    disabled={loading}
                />
            </View>

            {/* Announcement Feed */}
            <ModularListView
                data={announcements}
                loading={loading}
                error={error}
                emptyText="No announcements available."
                renderItem={renderAnnouncement}
                keyExtractor={(item) => item.announcement_id}
            />


            {/* Acknowledgement Modal */}
            {selectedAnnouncementId && ackModalVisible && (
                <AdmAckModal
                    announcement_id={selectedAnnouncementId}
                    modalVisible={ackModalVisible}
                    onClose={closeAckModal}
                />
            )}

        </Card>

    );
};

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        flexWrap: "wrap",        // allow wrapping
        justifyContent: "space-between",
        gap: 10,                 // spacing between items
        marginVertical: 10,
    },

    // Buttons
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",   // pushes both buttons to the right
        alignItems: "center",
        marginTop: 5,
        gap: 10,
    },
    deleteButton: {
        flexShrink: 1,
        borderColor: Colors.borderRed,
        borderWidth: 1,
    },
    ackButton: {
        flexShrink: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: Colors.bgBlue,
        borderColor: Colors.borderBlue,
        borderWidth: 1,
    },
});

export default AdmAnncFeed;
