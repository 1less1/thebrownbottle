import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import { deleteTimeOffRequest } from '@/routes/time_off_request';
import { useConfirm } from '@/hooks/useConfirm';
import { User, useSession } from '@/utils/SessionContext';
import { TimeOffRequest } from '@/types/iTimeOff';
import { formatDate, formatDateTime } from '@/utils/dateTimeHelpers';


interface ModalProps {
    visible: boolean;
    onClose: () => void;
    request: TimeOffRequest | null;
    onSubmitted?: () => void;
}

const TimeOffDetails: React.FC<ModalProps> = ({
    visible,
    onClose,
    request,
    onSubmitted
}) => {

    const { user } = useSession();
    const { confirm } = useConfirm();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!request || loading) return;

        const ok = await confirm(
            "Confirm Deletion",
            "Are you sure you want to delete this request? This action cannot be undone."
        );
        if (!ok) return;

        try {
            setLoading(true);
            await deleteTimeOffRequest(request.request_id);
            alert("Time Off Request Successfully deleted!");
            onSubmitted?.();
            onClose?.();
        } catch (err) {
            console.error("Failed to delete request:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!request) return null;
    return (
        <ModularModal visible={visible} onClose={onClose}>
            <View>
                <Text style={GlobalStyles.modalTitle}>
                    Time Off Request
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Date: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {request.start_date === request.end_date
                        ? formatDate(request.start_date)
                        : `${formatDate(request.start_date)} → ${formatDate(request.end_date)}`
                    }
                </Text>
            </View>


            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Reason: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {request.reason}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={[GlobalStyles.altText, { marginTop: 2, color: Colors.gray }]}>
                    Submitted on {formatDateTime(request.timestamp)}
                </Text>
            </View>

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>
                {request.status === "Pending" && (
                    <ModularButton
                        text={loading ? "Removing..." : "Remove"}
                        style={[GlobalStyles.deleteButton, { flex: 1 }]}
                        onPress={handleDelete}
                        enabled={!loading}
                    />
                )}
                <ModularButton
                    text="Close"
                    textStyle={{ color: "gray" }}
                    style={[GlobalStyles.cancelButton, { flex: 1 }]}
                    onPress={onClose}
                />
            </View>


        </ModularModal>

    );
};

export default TimeOffDetails;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
})