import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import ModalDetails from '@/components/calendar/ShiftCover/Templates/ModalDetails';

import { updateShiftCoverRequest, approveShiftCoverRequest } from '@/routes/shift_cover_request';
import { ShiftCoverRequest, UpdateShiftCoverRequest } from '@/types/iShiftCover';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from '@/utils/SessionContext';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    request: ShiftCoverRequest | null;
    onSubmitted?: () => void;
}

const ShiftCoverModal: React.FC<ModalProps> = ({ visible, request, onClose, onSubmitted }) => {
    if (!request) return null;

    const { user } = useSession();
    const [loading, setLoading] = useState(false);
    const { confirm } = useConfirm();

    const isCompleted = request.status === "Accepted" || request.status === "Denied";

    const handleAccept = async () => {

        const ok = await confirm(
            "Confirm Accept",
            "Are you sure you want to accept this request?"
        );

        if (!ok) return;

        setLoading(true);

        try {
            await approveShiftCoverRequest(request.cover_request_id);
            alert("Request successfully accepted!");
            onSubmitted?.();
            onClose?.();
        } catch (error: any) {
            alert("Failed to accept request: " + error.message);
        } finally {
            setLoading(false);
        }

    };

    const handleDeny = async () => {

        const ok = await confirm(
            "Confirm Deny",
            "Are you sure you want to deny this request?"
        );

        if (!ok) return;

        setLoading(true);

        try {
            const fields: Partial<UpdateShiftCoverRequest> = {
                status: "Denied",
            };

            await updateShiftCoverRequest(request.cover_request_id, fields);
            alert("Request successfully denied!");
            onSubmitted?.();
            onClose?.();
        } catch (error: any) {
            console.error("Failed to deny request:", error.message);
        } finally {
            setLoading(false);
        }

    };

    return (

        <ModularModal visible={visible} onClose={onClose}>

            <ModalDetails request={request} />

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>

                {/* Only show Accept/Deny if NOT completed */}
                {!isCompleted && (
                    <>
                        <ModularButton
                            text="Accept"
                            style={[GlobalStyles.acceptButton, { flex: 1 }]}
                            onPress={handleAccept}
                            enabled={!loading}
                        />

                        <ModularButton
                            text="Deny"
                            style={[GlobalStyles.deleteButton, { flex: 1 }]}
                            onPress={handleDeny}
                            enabled={!loading}
                        />
                    </>
                )}

                {/* Always show Close */}
                <ModularButton
                    text="Close"
                    textStyle={{ color: "gray" }}
                    style={[GlobalStyles.cancelButton, { flex: 1 }]}
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
})

export default ShiftCoverModal;