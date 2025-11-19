import React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface ModularListViewProps<T> {
    data: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor?: (item: T, index: number) => string | number;
    loading?: boolean;
    error?: string | null;
    emptyText?: string;
    maxHeight?: number;
    refreshing?: boolean;
    onRefresh?: () => void;
}

export default function ModularListView<T>({
    data,
    renderItem,
    keyExtractor,
    loading,
    error,
    emptyText = 'No requests yet.',
    maxHeight = 350,
    refreshing,
    onRefresh,
}: ModularListViewProps<T>) {
    if (loading)
        return (
            <View style={styles.statusContainer}>
                <ActivityIndicator color={Colors.gray} size="small" />
                <Text style={styles.statusText}>Loading...</Text>
            </View>
        );

    if (error)
        return (
            <View style={styles.statusContainer}>
                <Text style={[styles.statusText, styles.errorText]}>{error}</Text>
            </View>
        );

    if (data.length === 0)
        return (
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{emptyText}</Text>
            </View>
        );

    return (
        <FlatList
            style={{ marginTop: 10, maxHeight }}
            data={data}
            keyExtractor={(item, index) =>
                keyExtractor ? String(keyExtractor(item, index)) : String(index)
            }
            renderItem={({ item, index }) => (
                <View style={styles.requestItem}>{renderItem(item, index)}</View>
            )}
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={true}
        />
    );
}

const styles = StyleSheet.create({
    statusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    statusText: {
        textAlign: 'center',
        color: Colors.gray,
        fontSize: 13,
        marginTop: 5,
    },
    errorText: {
        color: 'red',
        marginTop: 15,
        textAlign: 'center',
    },
    requestItem: {
        backgroundColor: Colors.inputBG,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        marginBottom: 10,
    },

});
