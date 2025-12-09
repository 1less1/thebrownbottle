import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import ModalDetails from '@/components/calendar/TimeOff/Templates/ModalDetails';

import { updateTimeOffRequest } from '@/routes/time_off_request';
import { TimeOffRequest, UpdateTimeOffRequest } from '@/types/iTimeOff';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from '@/utils/SessionContext';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    request: TimeOffRequest | null;
    onSubmitted?: () => void;
}

const TimeOffModal: React.FC<ModalProps> = ({ visible, request, onClose, onSubmitted }) => {
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
            const fields: Partial<UpdateTimeOffRequest> = {
                status: "Accepted",
            };

            await updateTimeOffRequest(request.request_id, fields);
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
            const fields: Partial<UpdateTimeOffRequest> = {
                status: "Denied",
            };

            await updateTimeOffRequest(request.request_id, fields);
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

export default TimeOffModal;