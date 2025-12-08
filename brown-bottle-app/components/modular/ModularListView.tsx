import React from 'react';
import { ScrollView, FlatList, View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

import LoadingCircle from '@/components/modular/LoadingCircle';
import AnimatedTouchableWrapper from "@/components/modular/AnimatedTouchable";
import { GlobalStyles } from '@/constants/GlobalStyles';

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
    emptyText = 'Nothing yet...',
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
            <LoadingCircle size={"small"} />
        );

    // Handles error state
    if (error)
        return (
            <View style={styles.statusContainer}>
                <Text style={GlobalStyles.errorText}>{error}</Text>
            </View>
        );

    // Handles empty list display
    if (data.length === 0)
        return (
            <View style={styles.statusContainer}>
                <Text style={GlobalStyles.altText}>{emptyText}</Text>
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
                            <View style={[styles.listItem, itemContainerStyle]}>
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
        paddingVertical: 20,
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
    listItem: {
        backgroundColor: Colors.bgGray,
        padding: 12,
        width: '97.9%',
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        marginBottom: 5,
    },
});
