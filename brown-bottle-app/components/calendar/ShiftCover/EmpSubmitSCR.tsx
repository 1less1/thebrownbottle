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

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit?: () => void;
}

const EmpSubmitSCR: React.FC<Props> = ({ visible, onClose, onSubmit }) => {

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

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Form Validation
    const isValidForm =
        selectedDate.trim().length > 0 &&
        selectedShift != null;

    const handleSubmit = async () => {
        if (!user || loading || !selectedShift) return;

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

        try {
            setLoading(true);

            const payload: InsertShiftCoverRequest = {
                requested_employee_id: user.employee_id,
                shift_id: selectedShift.shift_id,
            };

            await insertShiftCoverRequest(payload);
            alert("Shift cover request submitted successfully!");
            onSubmit?.();
            resetForm();
            onClose();
        } catch (error: any) {
            alert("Failed to submit shift cover request!");
            console.log("Failed to submit shift cover request:", error.message);
        } finally {
            setLoading(false);
        }
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

            {/* Selected Date Display */}
            <View style={styles.dateContainer}>
                <Text style={[GlobalStyles.semiBoldText, { color: Colors.blue }]}>
                    {!selectedShift
                        ? "No shift selected"
                        : formatDateWithYear(selectedDate)
                    }
                </Text>
            </View>


            {/* Buttons */}
            <View style={GlobalStyles.buttonRowContainer}>
                <ModularButton
                    text={"Submit"}
                    textStyle={{ color: 'white' }}
                    style={[GlobalStyles.submitButton, { flex: 1 }]}
                    onPress={handleSubmit}
                    enabled={!loading && !loadingShifts && isValidForm}
                />
                <ModularButton
                    text="Cancel"
                    textStyle={{ color: 'gray' }}
                    style={[GlobalStyles.cancelButton, { flex: 1 }]}
                    onPress={handleClose}
                />
            </View>

        </ModularModal >

    );
};

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
    dateContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 5,
        backgroundColor: Colors.bgBlue,
        borderColor: Colors.borderBlue,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 15
    },
});

export default EmpSubmitSCR;
