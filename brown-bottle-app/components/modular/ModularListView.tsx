import React from 'react';
import { ScrollView, FlatList, View, Text, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';


interface ModularListViewProps<T> {
    data: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor?: (item: T, index: number) => string | number;
    loading?: boolean;
    error?: string | null;
    emptyText?: string;
    refreshing?: boolean;
    onRefresh?: () => void | Promise<void>;
}

export default function ModularListView<T>({
    data,
    renderItem,
    keyExtractor,
    loading,
    error,
    emptyText = 'No requests yet.',
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

        <View style={styles.listContainer}>
            {/* Nested the FlatList which renders contenr in a DISABLED Horizontal ScrollView to avoid rendering issues*/}
            <ScrollView horizontal={true} scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
                <FlatList
                    style={{ marginTop: 10}}
                    data={data}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    keyExtractor={(item, index) =>
                        keyExtractor ? String(keyExtractor(item, index)) : String(index)
                    }
                    renderItem={({ item, index }) => (
                        <View style={styles.requestItem}>{renderItem(item, index)}</View>
                    )}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        maxWidth: "100%",
        maxHeight: 300
    },
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