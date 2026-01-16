import React, { useState } from 'react';
import {
    ScrollView,
    FlatList,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
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
    listHeight?: number | "full" | undefined;
    maxHeight?: number;
    refreshing?: boolean;
    onRefresh?: () => void | Promise<void>;
    itemContainerStyle?: ViewStyle;
    enableAnimation?: boolean;
    onItemPress?: (item: T) => void;
}

const ITEMS_PER_PAGE = 15;

export default function ModularListView<T>({
    data,
    renderItem,
    keyExtractor,
    loading,
    error,
    emptyText = 'Nothing yet...',
    listHeight = "full",
    maxHeight,
    refreshing,
    onRefresh,
    itemContainerStyle,
    enableAnimation = true,
    onItemPress,
}: ModularListViewProps<T>) {
    // State to track current page
    const [currentPage, setCurrentPage] = useState(0);

    // Derived values for pagination
    const isPaginating = data.length > ITEMS_PER_PAGE;
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    // Slice data to show only current page items
    const paginatedData = isPaginating
        ? data.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
        : data;

    // Empty List Text
    const ListEmpty = () => {
        // If we are currently fetching, don't show the empty text
        if (loading) return null;

        return (
            <View style={styles.singleRow}>
                <Text style={GlobalStyles.text}>{emptyText}</Text>
            </View>
        );
    };

    // Pagination
    const ListFooter = () => {
        if (!isPaginating) return null;

        return (
            <View style={styles.paginationRow}>
                <TouchableOpacity
                    disabled={currentPage === 0}
                    onPress={() => setCurrentPage(prev => prev - 1)}
                    style={styles.navButton}
                >
                    <Text style={[styles.pageButtonText, currentPage === 0 && styles.disabledText]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                <Text style={[GlobalStyles.text, { fontSize: 12 }]}>
                    Page {currentPage + 1} of {totalPages}
                </Text>

                <TouchableOpacity
                    disabled={currentPage >= totalPages - 1}
                    onPress={() => setCurrentPage(prev => prev + 1)}
                    style={styles.navButton}
                >
                    <Text style={[styles.pageButtonText, currentPage >= totalPages - 1 && styles.disabledText]}>
                        Next
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={[styles.listContainer, maxHeight ? { maxHeight } : null]}>
            <ScrollView horizontal scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>

                {loading ? (
                    <View style={styles.singleRow}>
                        <LoadingCircle size="small" />
                    </View>
                ) : error ? (
                    <View style={styles.singleRow}>
                        <Text style={GlobalStyles.errorText}>
                            {error}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        style={[
                            { margin: 6 },
                            typeof listHeight === "number" && { height: listHeight },
                            listHeight === "full" && { flex: 1 },
                        ]}
                        data={paginatedData}
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
                        ListEmptyComponent={ListEmpty}
                        ListFooterComponent={ListFooter}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        maxWidth: "100%",
    },
    listItem: {
        width: '97%',
        alignSelf: 'center',
        margin: 5,
        padding: 12,
        backgroundColor: Colors.bgGray,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 14,
    },
    singleRow: {
        flex: 1,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        margin: 5,
    },
    paginationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginTop: 5,
    },
    navButton: {
        padding: 8,
    },
    pageButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.buttonBlue, // Fallback color
    },
    disabledText: {
        opacity: 0.3,
    }
});