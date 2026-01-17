import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import SCRModalContent from '@/components/admin/ShiftCover/Templates/SCRModalContent';

import { updateShiftCoverRequest, approveShiftCoverRequest } from '@/routes/shift_cover_request';
import { ShiftCoverRequest, UpdateShiftCoverRequest } from '@/types/iShiftCover';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from '@/utils/SessionContext';

interface Props {
    visible: boolean;
    onClose: () => void;
    request: ShiftCoverRequest;
    onSubmit?: () => void;
}

const AdmSCRModal: React.FC<Props> = ({ visible, request, onClose, onSubmit }) => {

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

            await approveShiftCoverRequest(request.cover_request_id);
            alert("Request successfully approved!");
            onSubmit?.();
            onClose?.();
        } catch (error: any) {
            alert("Failed to approve shift cover request!")
            console.log("Failed to approve request:", error.message);
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

            const fields: Partial<UpdateShiftCoverRequest> = {
                status: "Denied",
            };

            await updateShiftCoverRequest(request.cover_request_id, fields);
            alert("Shift cover request successfully denied!");
            onSubmit?.();
            onClose();
        } catch (error: any) {
            alert("Failed to deny shift cover request!");
            console.error("Failed to deny shift cover request:", error.message);
        } finally {
            setLoading(false);
        }

    };

    return (

        <ModularModal visible={visible} onClose={onClose}>

            <SCRModalContent request={request} />

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>

                {/* Only show Accept/Deny if NOT "Completed" */}
                {!isCompleted && (
                    <>
                        {/* Accept Button */}
                        <ModularButton
                            text="Accept"
                            textStyle={{ color: Colors.green }}
                            style={[GlobalStyles.borderButton, styles.acceptButton]}
                            onPress={handleAccept}
                            enabled={!loading}
                        />

                        {/* Deny Button */}
                        <ModularButton
                            text="Deny"
                            textStyle={{ color: Colors.red }}
                            style={[GlobalStyles.borderButton, styles.denyButton]}
                            onPress={handleDeny}
                            enabled={!loading}
                        />
                    </>
                )}

                {/* Always show Close Button */}
                <ModularButton
                    text="Close"
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
    denyButton: {
        flexGrow: 1,
        backgroundColor: Colors.bgRed,
        borderColor: Colors.borderRed,
        alignItems: "center"
    },
    acceptButton: {
        flexGrow: 1,
        backgroundColor: Colors.bgGreen,
        borderColor: Colors.borderGreen,
        alignItems: "center"
    },
})

export default AdmSCRModal;