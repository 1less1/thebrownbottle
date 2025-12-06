import React from 'react';
import { ScrollView, FlatList, View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import AnimatedTouchableWrapper from "@/components/modular/AnimatedTouchable";

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
    enableAnimation?: boolean;
    onItemPress?: (item: T) => void;
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
    enableAnimation = true,
    onItemPress,
}: ModularListViewProps<T>) {

    // Handles loading state
    if (loading)
        return (
            <View style={styles.statusContainer}>
                <ActivityIndicator color={Colors.gray} size="small" />
                <Text style={styles.statusText}>Loading...</Text>
            </View>
        );

    // Handles error state
    if (error)
        return (
            <View style={styles.statusContainer}>
                <Text style={[styles.statusText, styles.errorText]}>{error}</Text>
            </View>
        );

    // Handles empty list display
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
                    renderItem={({ item, index }) => {
                        const content = (
                            <View style={[styles.requestItem, itemContainerStyle]}>
                                {renderItem(item, index)}
                            </View>
                        );

                        if (!enableAnimation)
                            return content;

                        return (
                            <AnimatedTouchableWrapper
                                onPress={() => onItemPress?.(item)}
                                style={{ marginBottom: 2 }}
                                pressScale={0.97}
                                hoverScale={1.02}
                            >
                                {content}
                            </AnimatedTouchableWrapper>
                        );
                    }}
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
        width: '97.5%',
        alignSelf: 'center',
        padding: 12,
        marginTop: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        marginBottom: 5,
    },
});
