import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import SCRModalContent from '@/components/admin/ShiftCover/Templates/SCRModalContent';

import { ShiftCoverRequest, Status } from '@/types/iShiftCover';
import { updateShiftCoverRequest, deleteShiftCoverRequest } from '@/routes/shift_cover_request';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from '@/utils/SessionContext';

interface Props {
    visible: boolean;
    onClose: () => void;
    request: ShiftCoverRequest;
    onSubmit?: () => void;
}

const EmpSCRModal: React.FC<Props> = ({ visible, request, onClose, onSubmit }) => {

    const { user } = useSession();
    const { confirm } = useConfirm();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!request || loading) return;

        const ok = await confirm(
            "Confirm Request",
            "Are you sure you want to request this shift?"
        );
        if (!ok) return;

        try {
            setLoading(true);

            const fields = {
                status: "Awaiting Approval" as Status,
                accepted_employee_id: Number(user?.employee_id),
            };

            await updateShiftCoverRequest(request.cover_request_id, fields)
            alert("Request is now awaiting manager approval.");
            onSubmit?.();
            onClose();
        } catch (error: any) {
            alert("Failed to submit shift cover request!");
            console.log("Failed to submit shift cover request:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!request || loading) return;

        const ok = await confirm(
            "Confirm Delete",
            "Are you sure you want to delete this request? This action cannot be undone."
        );
        if (!ok) return;

        try {
            setLoading(true);

            await deleteShiftCoverRequest(request.cover_request_id);
            alert("Shift cover request successfully deleted!");
            onSubmit?.();
            onClose();
        } catch (error: any) {
            alert("Failed to delete shift cover request!");
            console.log("Failed to delete shift cover request:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const isOwner = Number(request?.requested_employee_id) === Number(user?.employee_id);
    const isLocked = ["Accepted", "Denied", "Awaiting Approval"].includes(request.status);
    const isPending = request.status === "Pending";

    return (

        <ModularModal visible={visible} onClose={onClose}>

            <SCRModalContent request={request} />

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>
                {/* Only show Delete/Request Button if NOT "Locked" */}
                {!isLocked && (
                    isOwner ? (
                        // Delete Button
                        <ModularButton
                            text="Delete"
                            textStyle={{ color: Colors.red }}
                            style={[GlobalStyles.borderButton, styles.deleteButton]}
                            onPress={handleDelete}
                            enabled={!loading}
                        />
                    ) : (
                        // Request Shift Button
                        <ModularButton
                            text="Request"
                            textStyle={{ color: Colors.blue }}
                            style={[GlobalStyles.borderButton, styles.requestShiftButton]}
                            onPress={handleSubmit}
                            enabled={!loading}
                        />
                    )
                )}

                {/* Always show Close Button */}
                <ModularButton
                    text={isLocked ? "Close" : "Cancel"}
                    textStyle={{ color: "gray" }}
                    style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
                    onPress={onClose}
                />
            </View>

        </ModularModal >

    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
    deleteButton: {
        flexGrow: 1,
        backgroundColor: Colors.bgRed,
        borderColor: Colors.borderRed,
        alignItems: "center"
    },
    requestShiftButton: {
        flexGrow: 1,
        backgroundColor: Colors.bgBlue,
        borderColor: Colors.borderBlue,
        alignItems: "center"
    },
})

export default EmpSCRModal;