import React from 'react';
import ModularModal from '@/components/modular/ModularModal';
import { ShiftDetailsModalProps } from '@/types/iShiftCover';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import ModularButton from '@/components/modular/ModularButton';
import { formatShiftDate, formatTime } from '@/utils/dateTimeHelpers';
import { updateShiftCoverRequest } from '@/routes/shift_cover_requests';
import { useConfirm } from '@/hooks/useConfirm';
import { User, useSession } from '@/utils/SessionContext';
import { useState } from 'react';
import { deleteShiftCoverRequest } from '@/routes/shift_cover_requests';

const ShiftDetailsModal: React.FC<ShiftDetailsModalProps> = ({
    visible,
    onClose,
    request,
    onSubmitted
}) => {
    const { confirm } = useConfirm();
    const { user } = useSession();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (submitting) return;

        const ok = await confirm(
            "Confirm Request",
            "Are you sure you want to request this shift?"
        );

        if (!ok) return;

        try {
            const payload = {
                cover_request_id: request.cover_request_id,
                status: "Awaiting Approval",
                accepted_employee_id: Number(user?.employee_id)
            };
            setSubmitting(true);
            await updateShiftCoverRequest({
                cover_request_id: request.cover_request_id,
                status: "Awaiting Approval",
                accepted_employee_id: Number(user?.employee_id),
            });


            console.log("Submitting payload:", payload);

            alert("Request is now awaiting manager approval.");

            onSubmitted?.();
            onClose?.();
        } catch (err) {
            console.error("Failed to submit request:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!request || submitting) return;

        const ok = await confirm(
            "Delete Request",
            "Are you sure you want to delete this request?"
        );
        if (!ok) return;

        try {
            setSubmitting(true);
            await deleteShiftCoverRequest(request.cover_request_id);
            alert("Shift cover request deleted.");
            onSubmitted?.();
            onClose?.();
        } catch (err) {
            console.error("Failed to delete request:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };


    const isOwner = Number(request?.requested_employee_id) === Number(user?.employee_id);
    const isLocked = request?.status === "Accepted" || request?.status === "Denied";

    if (!request) return null;
    return (
        <ModularModal visible={visible} onClose={onClose}>
            <View>
                <Text style={GlobalStyles.modalTitle}>
                    {request.requested_first_name} {request.requested_last_name}'s Shift
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={GlobalStyles.boldMediumText}>Date:</Text>
                <Text style={GlobalStyles.boldMediumText}>
                    {formatShiftDate(request.shift_date)}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.boldMediumText}>Time:</Text>
                <Text style={GlobalStyles.boldMediumText}>
                    {formatTime(request.shift_start)}
                </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRowContainer}>
                {isOwner ? (
                    <ModularButton
                        text={submitting ? "Removing..." : "Remove Request"}
                        enabled={!submitting && !isLocked}
                        style={[GlobalStyles.deleteButton]}
                        onPress={handleDelete}
                    />

                ) : (
                    <ModularButton
                        text={submitting ? "Requesting..." : "Request Shift"}
                        enabled={!submitting && request.status === "Pending"}
                        textStyle={{ color: "white" }}
                        style={[GlobalStyles.submitButton, { flex: 1 }]}
                        onPress={handleSubmit}
                    />
                )}

                <ModularButton
                    text="Cancel"
                    textStyle={{ color: "gray" }}
                    style={[GlobalStyles.cancelButton, { flex: 1 }]}
                    onPress={onClose}
                />
            </View>


        </ModularModal>
    )
}

export default ShiftDetailsModal

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
    buttonRowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    requestButton: {
        width: '50%'

    },
    deleteButton: {

    },
    cancelButton: {
        width: '50%'
    }
})