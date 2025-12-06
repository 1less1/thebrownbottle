import React from 'react';
import ModularModal from '@/components/modular/ModularModal';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import ModularButton from '@/components/modular/ModularButton';
import { formatDateTime, formatShiftDate, formatTime } from '@/utils/dateTimeHelpers';
import { updateShiftCoverRequest } from '@/routes/shift_cover_request';
import { useConfirm } from '@/hooks/useConfirm';
import { User, useSession } from '@/utils/SessionContext';
import { useState } from 'react';
import { deleteShiftCoverRequest } from '@/routes/shift_cover_request';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    request: any | null;
    onSubmitted?: () => void;
}
const ShiftDetails: React.FC<ModalProps> = ({
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

            await updateShiftCoverRequest(request.cover_request_id, {
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
            "Confirm Deletion",
            "Are you sure you want to delete this request? This action cannot be undone."
        );
        if (!ok) return;

        try {
            setSubmitting(true);
            await deleteShiftCoverRequest(request.cover_request_id);
            alert("Shift Cover Request Successfully deleted!");
            onSubmitted?.();
            onClose?.();
        } catch (err) {
            console.error("Failed to delete request:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };


    if (!request) return null;

    const isOwner = Number(request?.requested_employee_id) === Number(user?.employee_id);
    const isLocked = ["Accepted", "Denied", "Awaiting Approval"].includes(request.status);
    const isPending = request.status === "Pending";

    return (
        <ModularModal visible={visible} onClose={onClose}>
            <View>
                <Text style={GlobalStyles.modalTitle}>
                    {request.requested_first_name} {request.requested_last_name}'s Shift
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Date: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {formatShiftDate(request.shift_date)}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Start Time: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {formatTime(request.shift_start)}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={GlobalStyles.semiBoldMediumText}>Section: </Text>
                <Text style={GlobalStyles.mediumText}>
                    {request.section_name}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={[GlobalStyles.altText, { marginTop: 2, color: Colors.gray }]}>
                    Submitted on {formatDateTime(request.timestamp)}
                </Text>
            </View>

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>

                {!isLocked && (
                    isOwner ? (
                        <ModularButton
                            text={submitting ? "Removing..." : "Remove"}
                            style={[GlobalStyles.deleteButton, { flex: 1 }]}
                            onPress={handleDelete}
                            enabled={!submitting}
                        />
                    ) : (
                        <ModularButton
                            text={submitting ? "Requesting..." : "Request Shift"}
                            textStyle={{ color: "white" }}
                            style={[GlobalStyles.submitButton, { flex: 1 }]}
                            onPress={handleSubmit}
                            enabled={!submitting && isPending}
                        />
                    )
                )}

                <ModularButton
                    text={isLocked ? "Close" : "Cancel"}
                    textStyle={{ color: "gray" }}
                    style={[GlobalStyles.cancelButton, { flex: 1 }]}
                    onPress={onClose}
                />

            </View>



        </ModularModal>

    );
};

export default ShiftDetails

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
})