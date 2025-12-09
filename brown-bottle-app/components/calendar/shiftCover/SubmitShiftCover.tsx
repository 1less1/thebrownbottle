import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import { useSession } from '@/utils/SessionContext';
import ModularModal from '@/components/modular/ModularModal';
import CalendarWidget from '../CalendarWidget';
import ModularButton from '@/components/modular/ModularButton';
import LoadingCircle from '@/components/modular/LoadingCircle';

import { Shift } from '@/types/iShift';
import { formatDateWithYear } from '@/utils/dateTimeHelpers';
import { useConfirm } from '@/hooks/useConfirm';

import { insertShiftCoverRequest, hasPendingRequest } from '@/routes/shift_cover_request';
import { InsertShiftCoverRequest } from '@/types/iShiftCover';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmitted?: () => void;
}

const SubmitShiftCover: React.FC<ModalProps> = ({ visible, onClose, onSubmitted }) => {
    const { user } = useSession();
    const { confirm } = useConfirm();

    const [loading, setLoading] = useState(false);
    const [loadingShifts, setLoadingShifts] = useState(true);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const resetForm = () => {
        setSelectedDate("");
        setSelectedShift(null);
    };

    const handleSubmit = async () => {

        if (!user) {
            alert('User not found. Please log in again.');
            return;
        }

        if (!selectedShift) {
            alert('No shift found for this date.');
            return;
        }

        if (loading) return;

        // I NEED to add a SQL TRIGGER for this!!!
        const alreadyExists = await hasPendingRequest(
            Number(user.employee_id),
            selectedShift.shift_id
        );

        if (alreadyExists) {
            alert("A request already exists for this shift and cannot be posted.");
            return;
        }

        const ok = await confirm(
            'Confirm Submission',
            `Submit Shift Cover Request?`
        );

        if (!ok) return;

        setLoading(true);

        try {
            setLoading(true);

            const payload: InsertShiftCoverRequest = {
                requested_employee_id: user.employee_id,
                shift_id: selectedShift.shift_id,
            };

            await insertShiftCoverRequest(payload);
            alert("Shift cover request submitted successfully!");
            onSubmitted?.();
            resetForm();
            onClose();
        } catch (error: any) {
            alert("Failed to submit request: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (

        <ModularModal visible={visible} onClose={onClose}>

            {/* Modal Title */}
            <Text style={GlobalStyles.modalTitle}>New Shift Cover Request</Text>


            {/* Calendar */}
            <View style={styles.calendarContainer}>
                <CalendarWidget
                    mode="picker"
                    showShifts={true}
                    requireShiftSelection={true}
                    initialDate={selectedDate}
                    onLoadingChange={setLoadingShifts}
                    onSelectDate={({ date, shift }) => {
                        setSelectedDate(date);
                        setSelectedShift(shift);
                    }}
                />
                {(loadingShifts) && (
                    <View>
                        <LoadingCircle size="large" />
                    </View>
                )}
            </View>

            <Text style={styles.selectedDate}>
                {!selectedShift
                    ? "No shift selected"
                    : formatDateWithYear(selectedDate)
                }
            </Text>

            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>
                <ModularButton
                    text={"Submit"}
                    textStyle={{ color: 'white' }}
                    style={GlobalStyles.submitButton}
                    onPress={handleSubmit}
                    enabled={!loading && !loadingShifts && selectedShift !== null}
                />
                <ModularButton
                    text="Cancel"
                    textStyle={{ color: 'gray' }}
                    style={GlobalStyles.cancelButton}
                    onPress={handleClose}
                />
            </View>

        </ModularModal >

    );
};

export default SubmitShiftCover;

const styles = StyleSheet.create({
    calendarContainer: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.borderColor,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
    },
    selectedDate: {
        width: "100%",
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 18,
        backgroundColor: Colors.bgBlue,
        borderWidth: 1,
        borderColor: Colors.borderBlue,
        color: Colors.blue,
        padding: 8,
        textAlign: 'center',
        alignItems: 'center',
    }

});
