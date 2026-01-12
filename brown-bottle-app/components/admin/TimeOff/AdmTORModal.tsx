import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import TORModalContent from '@/components/admin/TimeOff/Templates/TORModalContent';

import { updateTimeOffRequest } from '@/routes/time_off_request';
import { TimeOffRequest, UpdateTimeOffRequest } from '@/types/iTimeOff';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from '@/utils/SessionContext';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    request: TimeOffRequest | null;
    onSubmit?: () => void;
}

const AdmTORModal: React.FC<ModalProps> = ({ visible, request, onClose, onSubmit }) => {
    if (!request) return null;

    const { user } = useSession();
    const { confirm } = useConfirm();


    const [loading, setLoading] = useState(false);

    const isCompleted = request.status === "Accepted" || request.status === "Denied";

    const handleAccept = async () => {
        if (!request || loading) return;

        const ok = await confirm(
            "Confirm Accept",
            "Are you sure you want to accept this request?"
        );
        if (!ok) return;

        try {
            setLoading(true);

            const fields: Partial<UpdateTimeOffRequest> = {
                status: "Accepted",
            };

            await updateTimeOffRequest(request.request_id, fields);
            alert("Request successfully accepted!");
            onSubmit?.();
            onClose();
        } catch (error: any) {
            alert("Failed to accept request: " + error.message);
        } finally {
            setLoading(false);
        }

    };

    const handleDeny = async () => {
        if (!request || loading) return;

        const ok = await confirm(
            "Confirm Deny",
            "Are you sure you want to deny this request?"
        );
        if (!ok) return;

        try {
            setLoading(true);

            const fields: Partial<UpdateTimeOffRequest> = {
                status: "Denied",
            };

            await updateTimeOffRequest(request.request_id, fields);
            alert("Request successfully denied!");
            onSubmit?.();
            onClose();
        } catch (error: any) {
            console.error("Failed to deny request:", error.message);
        } finally {
            setLoading(false);
        }

    };

    return (

        <ModularModal visible={visible} onClose={onClose}>

            <TORModalContent request={request} />

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>

                {/* Only show Accept/Deny if NOT "Completed" */}
                {!isCompleted && (
                    <>
                        {/* Accept Button */}
                        <TouchableOpacity
                            style={[GlobalStyles.borderButton, styles.acceptButton]}
                            onPress={handleAccept}
                            disabled={loading}>
                            <Ionicons name={"checkmark-outline"} size={20} color={Colors.green} />
                        </TouchableOpacity>

                        {/* Deny Button */}
                        <TouchableOpacity
                            style={[GlobalStyles.borderButton, styles.denyButton]}
                            onPress={handleDeny}
                            disabled={loading}>
                            <Ionicons name={"close-outline"} size={20} color={Colors.red} />
                        </TouchableOpacity>
                    </>
                )}

                {/* Always show Close Button */}
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
    denyButton: {
        flex: 1,
        backgroundColor: Colors.bgRed,
        borderColor: Colors.borderRed,
        alignItems: "center"
    },
    acceptButton: {
        flex: 1,
        backgroundColor: Colors.bgGreen,
        borderColor: Colors.borderGreen,
        alignItems: "center"
    },
})

export default AdmTORModal;