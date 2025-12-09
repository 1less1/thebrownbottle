import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import ModalDetails from '@/components/calendar/TimeOff/Templates/ModalDetails';


import { deleteTimeOffRequest } from '@/routes/time_off_request';

import { TimeOffRequest } from '@/types/iTimeOff';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from '@/utils/SessionContext';


interface ModalProps {
    visible: boolean;
    onClose: () => void;
    request: TimeOffRequest | null;
    onSubmitted?: () => void;
}

const TimeOffDetails: React.FC<ModalProps> = ({
    visible,
    onClose,
    request,
    onSubmitted
}) => {

    const { user } = useSession();
    const { confirm } = useConfirm();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!request || loading) return;

        const ok = await confirm(
            "Confirm Deletion",
            "Are you sure you want to delete this request? This action cannot be undone."
        );

        if (!ok) return;

        try {
            setLoading(true);
            await deleteTimeOffRequest(request.request_id);
            alert("Time off request successfully deleted!");
            onSubmitted?.();
            onClose?.();
        } catch (error: any) {
            alert("Failed to delete request: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!request) return null;

    return (

        <ModularModal visible={visible} onClose={onClose}>

            <ModalDetails request={request} />

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>
                {request.status === "Pending" && (
                    <ModularButton
                        text={loading ? "Removing..." : "Remove"}
                        style={[GlobalStyles.deleteButton, { flex: 1 }]}
                        onPress={handleDelete}
                        enabled={!loading}
                    />
                )}
                <ModularButton
                    text="Close"
                    textStyle={{ color: "gray" }}
                    style={[GlobalStyles.cancelButton, { flex: 1 }]}
                    onPress={onClose}
                />
            </View>

        </ModularModal>

    );
};

export default TimeOffDetails;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
})