import React from 'react';
import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Pressable } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import TORModalContent from '@/components/admin/TimeOff/Templates/TORModalContent';

import { TimeOffRequest } from '@/types/iTimeOff';
import { deleteTimeOffRequest } from '@/routes/time_off_request';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from '@/utils/SessionContext';


interface Props {
    visible: boolean;
    onClose: () => void;
    request: TimeOffRequest;
    onSubmit?: () => void;
}

const EmpTORModal: React.FC<Props> = ({ visible, request, onClose, onSubmit }) => {

    const { user } = useSession();
    const { confirm } = useConfirm();

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!request || loading) return;

        const ok = await confirm(
            "Confirm Delete",
            "Are you sure you want to delete this request? This action cannot be undone."
        );

        if (!ok) return;

        try {
            setLoading(true);

            await deleteTimeOffRequest(request.request_id);
            alert("Time off request successfully deleted!");
            onSubmit?.();
            onClose();
        } catch (error: any) {
            alert("Failed to delete time off request!");
            console.log("Failed to delete time off request:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <ModularModal visible={visible} onClose={onClose}>

            <TORModalContent request={request} />

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>
                {request.status === "Pending" && (
                    // Delete Button
                    <ModularButton
                        text="Delete"
                        textStyle={{ color: Colors.red }}
                        style={[GlobalStyles.borderButton, styles.deleteButton]}
                        onPress={handleDelete}
                        enabled={!loading}
                    />
                )}

                {/* Always show Close Button */}
                <ModularButton
                    text="Close"
                    textStyle={{ color: "gray" }}
                    style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
                    onPress={onClose}
                />
            </View>

        </ModularModal>

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
})

export default EmpTORModal;
