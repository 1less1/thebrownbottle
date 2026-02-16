import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useWindowDimensions, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Pressable } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import ModularDropdown from '@/components/modular/dropdown/ModularDropdown';
import TimeDropdown from '@/components/modular/dropdown/TimeDropdown';

import LoadingCircle from '@/components/modular/LoadingCircle';

import { yesNoDropdownOptions } from '@/types/iDropdown';

import { Availability, GetAvailability, UpdateAvailability } from '@/types/iAvailability';
import { getAvailability, updateAvailability } from '@/routes/availability';
import { convertToSQL24HRTime, isValidTime } from '@/utils/dateTimeHelpers';

import { useConfirm } from '@/hooks/useConfirm';

interface AvailModalProps {
    visible: boolean;
    onClose: () => void;
    employeeId: number;
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AvailabilityModal: React.FC<AvailModalProps> = ({ visible, onClose, employeeId }) => {
    if (!employeeId) return;

    const { height } = useWindowDimensions();
    const HEIGHT = height;

    const { confirm } = useConfirm();

    const [loading, setLoading] = useState(false);

    const [originalAvailability, setOriginalAvailability] = useState<Availability[] | null>(null);
    const [formData, setFormData] = useState<Availability[] | null>(null);

    const handleClose = () => {
        onClose();
        setOriginalAvailability(null);
        setFormData(null);
    }


    // Form Validation
    const isValidForm = useMemo(() => (
        formData?.every(day => {
            // Basic requirement: must have employee ID and valid availability status
            const isStructureValid = !!day.employee_id && (day.is_available === 0 || day.is_available === 1);

            // Time Validation Logic:
            let isTimeValid = true;

            if (day.is_available === 1) {
                const notEmpty = day.start_time && day.start_time.trim().length > 0;

                // Verify that time is valid if notEmpty --> HH:MM AM/PM
                // Otherwise, the time must be null so default to true
                if (notEmpty) {
                    isTimeValid = isValidTime(day.start_time!);
                } else {
                    isTimeValid = true;
                }
            }
            return isStructureValid && isTimeValid;
        }) || false
    ), [formData]);

    // Form Changed?
    const isDirty = useMemo(() => {
        if (!originalAvailability || !formData) return false;
        return JSON.stringify(formData) !== JSON.stringify(originalAvailability);
    }, [formData, originalAvailability]);

    const canUpdate = isDirty && isValidForm && !loading;


    // Updates values within each availability record
    const handleChange = (index: number, field: keyof UpdateAvailability, value: any) => {
        if (!formData) return;
        const updated = [...formData];

        // Update the specific record in the list
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        setFormData(updated);
    };


    // Fetch employee availability (Sunday through Saturday)
    const fetchAvailability = useCallback(async () => {
        if (!employeeId) return;
        try {
            setLoading(true);

            const params: Partial<GetAvailability> = { employee_id: employeeId };
            const data = await getAvailability(params);

            // Sort data Sunday through Saturday
            const sortedData = data.sort((a: Availability, b: Availability) => {
                return daysOfWeek.indexOf(a.day_of_week) - daysOfWeek.indexOf(b.day_of_week);
            });

            const formattedData = sortedData.map((day: Availability) => ({
                ...day,
                start_time: day.start_time ?? "",
                end_time: day.end_time ?? "",
            }));

            setOriginalAvailability(formattedData);
            setFormData(formattedData);
        } catch (error: any) {
            alert("Failed to fetch employee availability: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [employeeId]);


    // Fetch availability on initialization and state update
    useEffect(() => {
        // Only fetch when modal opens
        if (visible) {
            fetchAvailability();
        }
    }, [fetchAvailability, visible]);


    // Update Availability
    // Creates promises for all availability records
    // Sends 7 PATCH requests (one for each day) in parallel
    const updateAllAvailability = async () => {
        if (!formData || formData.length === 0) return;

        // Confirmation Popup
        const ok = await confirm(
            "Confirm Update",
            `Are you sure you want to update availability?`
        );
        if (!ok) return;

        try {
            setLoading(true);

            // Map the list into an array of promises
            const patchRequests = formData.map((day: Availability) => {

                const startTimePayload = (day.is_available === 1 && day.start_time && day.start_time.trim() !== "")
                    ? convertToSQL24HRTime(day.start_time)
                    : null;

                /*
                const endTimePayload = (day.is_available === 1 && day.end_time && day.end_time.trim() !== "")
                    ? convertToSQL24HRTime(day.end_time)
                    : null;
                */

                const fields: UpdateAvailability = {
                    day_of_week: day.day_of_week,
                    is_available: day.is_available,
                    start_time: startTimePayload,
                    // end_time is in the db for future features, right now it is not needed for current use case
                    // default to null
                    end_time: null,
                };

                return updateAvailability(day.availability_id, fields);
            });

            // Execute all PATCH requests (7 days) in parallel
            await Promise.all(patchRequests);
            alert("All availability records updated successfully!");
            handleClose();
        } catch (error: any) {
            alert("Failed to update availability records: " + error.message);
        } finally {
            setLoading(false);
        }
    };


    if (!formData) return null;

    return (

        <ModularModal visible={visible} onClose={handleClose} scroll={false}>

            {/* Header */}
            <Text style={GlobalStyles.modalTitle}>Availability</Text>

            {/* Availability Form */}
            {!formData ? (
                <LoadingCircle size="small" />
            ) : (
                <>

                    <View style={[styles.formContainer, { height: HEIGHT * 0.42 }]}>
                        <ScrollView>
                            {formData.map((day, index) => (
                                <View key={day.day_of_week} style={styles.dayRow}>
                                    {/* Day Status */}
                                    <View>
                                        <Text style={[GlobalStyles.mediumText, { marginBottom: 2 }]}>{day.day_of_week}</Text>
                                        <ModularDropdown
                                            data={yesNoDropdownOptions}
                                            selectedValue={day.is_available}
                                            onSelect={(val) => handleChange(index, 'is_available', val)}
                                            containerStyle={styles.dropdownButton}
                                            usePlaceholder={false}
                                            disabled={loading}
                                        />
                                    </View>

                                    {/* Start Time */}
                                    <View style={{ marginTop: 4 }}>
                                        <Text style={[GlobalStyles.mediumAltText, { marginBottom: 2 }]}>Earliest Start Time</Text>
                                        <TimeDropdown
                                            time={day.start_time!}
                                            onTimeChange={(val) => handleChange(index, 'start_time', val)}
                                            disabled={loading || (day.is_available == 0)}
                                        />
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>


                    {/* Buttons */}
                    <View style={GlobalStyles.buttonRowContainer}>
                        {/* Update Button */}
                        <ModularButton
                            text="Update"
                            textStyle={{ color: 'white' }}
                            style={[GlobalStyles.submitButton, { flexGrow: 1 }]}
                            onPress={() => {
                                updateAllAvailability();
                            }}
                            enabled={canUpdate} // Apply logic here
                        />
                        {/* Cancel Button */}
                        <ModularButton
                            text="Cancel"
                            textStyle={{ color: 'gray' }}
                            style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
                            onPress={handleClose}
                        />
                    </View>


                </>
            )}

        </ModularModal>

    );
};

const styles = StyleSheet.create({
    formContainer: {
        gap: 12,
        marginTop: 10,
    },
    dayRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    dropdownButton: {
        minWidth: 0,
        alignSelf: "flex-start",
    },
});

export default AvailabilityModal;