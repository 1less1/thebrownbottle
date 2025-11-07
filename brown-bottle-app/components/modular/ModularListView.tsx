import React from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
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
    header?: React.ReactNode;
    footer?: React.ReactNode;
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
    header,
    footer,
}: ModularListViewProps<T>) {
    if (loading) return <Text style={styles.status}>Loading...</Text>;
    if (error) return <Text style={[styles.status, styles.error]}>{error}</Text>;
    if (data.length === 0) return <Text style={styles.status}>{emptyText}</Text>;

    return (
        <ScrollView
            style={{ marginTop: 10, maxHeight }}
            refreshControl={
                onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined
            }
        >
            {header && <View style={styles.header}>{header}</View>}
            {data.map((item, index) => (
                <View key={keyExtractor ? keyExtractor(item, index) : index}>{renderItem(item, index)}</View>
            ))}
            {footer && <View style={styles.footer}>{footer}</View>}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    statusText: {
        textAlign: 'center',
        marginTop: 15,
        color: Colors.gray,
    },
    status: {
        fontSize: 12,
        color: Colors.gray,
        marginTop: 2,
    },
    error: { color: 'red' },
    header: { marginBottom: 8 },
    footer: { marginTop: 8 },
});
