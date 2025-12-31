import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, useWindowDimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from '@/components/modular/Card';
import RoleDropdown from '@/components/modular/dropdown/RoleDropdown';

import ModularDropdown from '@/components/modular/dropdown/ModularDropdown';
import ModularListView from "@/components/modular/ModularListView";
import AnnouncementListItem from '@/components/admin/Announcements/Templates/AnnouncementListItem';

import AckModal from '@/components/admin/Announcements/AckModal';

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

const AdminAnnouncements: React.FC<Props> = ({ parentRefresh, onRefreshDone }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const isMobile = WIDTH < 768;
    const cardHeight = isMobile ? height * 0.50 : height * 0.55;

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

    const { confirm } = useConfirm();
    const { user } = useSession();

    const fetchAnnouncements = useCallback(async () => {
        setError(null);
        setLoading(true);

        try {
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
        const ok = await confirm(
            "Confirm Deletion",
            `Are you sure you want to delete this announcement?`
        );

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

    const renderAnnouncement = (announcement: Announcement) => {
        return (
            <AnnouncementListItem
                announcement={announcement}
                handleDelete={handleDelete}
                handleViewAcks={() => openAckModal(announcement.announcement_id)}
                loading={loading}
            />
        );
    };

    return (

        <Card style={{ height: cardHeight }}>

            {/* Filter Container*/}
            <View style={styles.filterContainer}>
                <RoleDropdown
                    selectedRole={roleFilter}
                    onRoleSelect={(value) => setRoleFilter(value as number)}
                    labelText=""
                    usePlaceholder={true}
                    placeholderText="All Roles"
                    containerStyle={styles.dropdownButton}
                />

                <ModularDropdown
                    data={dateDropdownOptions}
                    onSelect={(value) => setTimestampFilter(value as DateSortType)}
                    selectedValue={timestampFilter}
                    usePlaceholder={false}
                    containerStyle={styles.dropdownButton}
                />
            </View>

            {/* Announcement Feed */}
            <ModularListView
                data={announcements}
                loading={loading}
                error={error}
                emptyText="No announcements available."
                renderItem={renderAnnouncement}
                keyExtractor={(item) => item.announcement_id.toString()}
            />


            {/* Announcement Modal */}
            {selectedAnnouncementId && ackModalVisible && (
                <AckModal
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
    dropdownButton: {
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 200,
    },
});

export default AdminAnnouncements;
