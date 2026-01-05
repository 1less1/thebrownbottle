import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import SCRModalContent from '@/components/calendar/ShiftCover/Templates/SCRModalContent';

import { ShiftCoverRequest, Status } from '@/types/iShiftCover';
import { updateShiftCoverRequest, deleteShiftCoverRequest } from '@/routes/shift_cover_request';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from '@/utils/SessionContext';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    request: ShiftCoverRequest | null;
    onSubmitted?: () => void;
}

const SCRInfo: React.FC<ModalProps> = ({
    visible,
    onClose,
    request,
    onSubmitted
}) => {

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
            onSubmitted?.();
            onClose?.();
        } catch (error: any) {
            alert("Failed to submit request: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!request || loading) return;

        const ok = await confirm(
            "Confirm Deletion",
            "Are you sure you want to delete this request? This action cannot be undone."
        );

        if (!ok) return;

        try {
            setLoading(true);
            await deleteShiftCoverRequest(request.cover_request_id);
            alert("Shift cover request successfully deleted!");
            onSubmitted?.();
            onClose?.();
        } catch (error: any) {
            alert("Failed to delete request: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!request) return null;

    const isOwner = Number(request?.requested_employee_id) === Number(user?.employee_id);
    const isLocked = ["Accepted", "Denied", "Awaiting Approval"].includes(request.status);
    const isPending = request.status === "Pending";

    return (

        <ModularModal visible={visible} onClose={onClose}>

            <SCRModalContent request={request} />

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>

                {!isLocked && (
                    isOwner ? (
                        <ModularButton
                            text={loading ? "Removing..." : "Remove"}
                            style={[GlobalStyles.deleteButton, { flex: 1 }]}
                            onPress={handleDelete}
                            enabled={!loading}
                        />
                    ) : (
                        <ModularButton
                            text={loading ? "Requesting..." : "Request Shift"}
                            textStyle={{ color: "white" }}
                            style={[GlobalStyles.submitButton, { flex: 1 }]}
                            onPress={handleSubmit}
                            enabled={!loading && isPending}
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

export default SCRInfo;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
})