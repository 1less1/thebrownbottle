import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, FlatList, ScrollView, useWindowDimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import LoadingCircle from '@/components/modular/LoadingCircle';

import { getAcknowledgedAnnouncements } from '@/routes/announcement';
import { Acknowledgement, GetAcknowledgedAnnouncements } from '@/types/iAnnouncement';

interface Props {
    announcement_id: number;
    modalVisible: boolean;
    onClose: () => void;
}

const AckModal: React.FC<Props> = ({ announcement_id, modalVisible, onClose }) => {
    // Early Escape
    if (!announcement_id) return null;

    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [acknowledgements, setAcknowledgements] = useState<Acknowledgement[]>([]);

    const fetchAcknowledgements = async () => {
        setError(null);
        setLoading(true);

        try {
            const params: Partial<GetAcknowledgedAnnouncements> = {
                announcement_id: announcement_id
            };
            const data = await getAcknowledgedAnnouncements(params);
            setAcknowledgements(data);

        } catch (error: any) {
            setError('Failed to fetch announcement acknowledgements!');
            console.log('Failed to fetch announcement acknowledgements', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch announcements on initialization and state update
    useEffect(() => {
        fetchAcknowledgements();
    }, []);


    const renderItem = ({ item }: { item: Acknowledgement }) => {
        return (
            <View style={styles.listRow}>
                <Text style={GlobalStyles.text}>{item.employee_name}</Text>
            </View>
        );
    };

    const ListEmpty = (
        <View style={styles.singleRow}>
            <Text style={GlobalStyles.text}>No employees have acknowledged yet!</Text>
        </View>
    );



    return (

        <ModularModal visible={modalVisible} onClose={onClose} scroll={false}>

            <View>
                <Text style={GlobalStyles.modalTitle}>Acknowledgements</Text>
            </View>

            <View style={{ height: HEIGHT * 0.35 }}>


                {loading ? (
                    // Loading state
                    <View style={styles.singleRow}>
                        <LoadingCircle size="small" />
                    </View>
                ) : error ? (
                    // Error state
                    <View style={styles.singleRow}>
                        <Text style={GlobalStyles.errorText}>
                            {error}
                        </Text>
                    </View>
                ) : (
                    // Success state
                    <FlatList
                        data={acknowledgements}
                        keyExtractor={(item) => item.employee_id.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator
                        nestedScrollEnabled
                        ListEmptyComponent={ListEmpty}
                    />
                )}

            </View>

            <View style={GlobalStyles.buttonRowContainer}>
                <ModularButton
                    text="Close"
                    textStyle={{ color: 'gray' }}
                    style={[GlobalStyles.cancelButton, { flex: 1 }]}
                    onPress={onClose}
                />
            </View>

        </ModularModal>

    );
};

const styles = StyleSheet.create({
    listRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: Colors.lightBorderColor,
    },
    singleRow: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
});

export default AckModal;
