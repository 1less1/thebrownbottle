import React from 'react';
import { ScrollView, FlatList, View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ModularListViewProps<T> {
    data: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor?: (item: T, index: number) => string | number;
    loading?: boolean;
    error?: string | null;
    emptyText?: string;
    listHeight?: number | "auto" | "full";
    maxHeight?: number;
    refreshing?: boolean;
    onRefresh?: () => void | Promise<void>;
    itemContainerStyle?: ViewStyle;
}

export default function ModularListView<T>({
    data,
    renderItem,
    keyExtractor,
    loading,
    error,
    emptyText = 'No items yet.',
    listHeight = "auto",
    maxHeight,
    refreshing,
    onRefresh,
    itemContainerStyle, 
}: ModularListViewProps<T>) {

    // --- UI States ---
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
        <View style={[styles.listContainer, maxHeight ? { maxHeight } : null]}>
            <ScrollView horizontal scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
                <FlatList
                    style={[
                        { margin: 6 },
                        typeof listHeight === "number" && { height: listHeight },
                        listHeight === "full" && { flex: 1 },
                    ]}
                    data={data}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                    keyExtractor={(item, index) =>
                        keyExtractor ? String(keyExtractor(item, index)) : String(index)
                    }

                    renderItem={({ item, index }) => (
                        <View style={[styles.requestItem, itemContainerStyle]}>
                            {renderItem(item, index)}
                        </View>
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
