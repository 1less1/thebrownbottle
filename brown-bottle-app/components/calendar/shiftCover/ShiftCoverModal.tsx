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
import { ShiftCoverModalProps, InsertShiftCoverRequest } from '@/types/iShiftCover';

const ShiftCoverModal: React.FC<ShiftCoverModalProps> = ({ visible, onClose, onSubmitted, requests }) => {
    const { user } = useSession();
    const [selectedDate, setSelectedDate] = useState('');
    const { confirm } = useConfirm();
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loadingShifts, setLoadingShifts] = useState(true);

    useEffect(() => {
        if (!visible) {
            setSelectedDate("");
            setSelectedShift(null);
            setSubmitting(false);
        }
    }, [visible]);

    const handleSubmit = async () => {
        if (submitting) return;

        // ------- Validation -----------
        if (!user) {
            alert('User not found. Please log in again.');
            return;
        }

        if (!selectedShift) {
            alert('No shift found for this date.');
            return;
        }

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

        setSubmitting(true);

        // ------- Payload being inserted -----------

        const payload: InsertShiftCoverRequest = {
            requested_employee_id: Number(user.employee_id),
            shift_id: selectedShift.shift_id,
        };

        try {
            await insertShiftCoverRequest(payload);
            alert("Cover request submitted!");
            onSubmitted?.();
            onClose();
        } catch (error) {
            alert("Failed to submit shift cover request.");
            console.error("Submit error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ModularModal visible={visible} onClose={onClose}>
            <Text style={GlobalStyles.modalTitle}>Create Request</Text>
            <View>
                <Text style={styles.subheading}>
                    Select A Shift
                </Text>
                <View style={{ alignItems: 'center' }}>
                    <View style={[
                        styles.calendarContainer,
                        { width: '100%', transform: [{ scale: 0.95 }] }
                    ]}
                    >
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
                            <View style={styles.overlay}>
                                <LoadingCircle size="large" />
                            </View>
                        )}

                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.selectedDate}>
                            {!selectedShift
                                ? "No shift selected"
                                : formatDateWithYear(selectedDate)
                            }
                        </Text>
                    </View>
                </View>


                {/* Buttons */}
                <View style={styles.buttonRowContainer}>
                    <ModularButton
                        text={submitting ? "Submitting..." : "Submit"}
                        enabled={!submitting && !loadingShifts && selectedShift !== null}
                        textStyle={{ color: 'white' }}
                        style={GlobalStyles.submitButton}
                        onPress={handleSubmit}
                    />
                    <ModularButton
                        text="Cancel"
                        textStyle={{ color: 'gray' }}
                        style={GlobalStyles.cancelButton}
                        onPress={onClose}
                    />
                </View>
            </View>
        </ModularModal>
    );
};

const styles = StyleSheet.create({
    calendarContainer: {
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.borderColor,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
    },
    subheading: {
        fontWeight: 600
    },
    textContainer: {
        width: '95.5%',
    },
    selectedDate: {
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 18,
        color: Colors.darkGray,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        padding: 8,
        textAlign: 'center',
        alignItems: 'center',
    },
    buttonRowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    dateContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 5,
        backgroundColor: 'white',
        borderColor: Colors.borderColor,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        textAlignVertical: 'center',
    },
    calendarButton: {
        backgroundColor: 'white',
        borderColor: Colors.darkTan,
        borderWidth: 1,
        flexShrink: 1,
        paddingHorizontal: 15,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: 12
    },

});

export default ShiftCoverModal;
