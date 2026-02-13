import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import TORModalContent from '@/components/admin/TimeOff/Templates/TORModalContent';

import { deleteTimeOffRequest, updateTimeOffRequest } from '@/routes/time_off_request';
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
            alert("Failed to deny request: " + error.message);
        } finally {
            setLoading(false);
        }

    };


    const handleDelete = async () => {
        if (!request || loading) return;

        const ok = await confirm(
            "Confirm Delete",
            "Are you sure you want to delete this request? The time off this employee requested will become available!"
        );
        if (!ok) return;

        try {
            setLoading(true);

            await deleteTimeOffRequest(request.request_id);
            alert("Request successfully deleted!");
            onSubmit?.();
            onClose();
        } catch (error: any) {
            alert("Failed to delete request: " + error.message);
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

                {/* Show Delete if request is "Completed" */}
                {isCompleted && (
                    <>
                        {/* Delete Button */}
                        <ModularButton
                            text="Delete"
                            textStyle={{ color: Colors.red }}
                            style={[GlobalStyles.borderButton, styles.deleteButton]}
                            onPress={handleDelete}
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
    deleteButton: {
        flexGrow: 1,
        backgroundColor: Colors.bgRed,
        borderColor: Colors.borderRed,
        alignItems: "center"
    },
})

export default AdmTORModal;