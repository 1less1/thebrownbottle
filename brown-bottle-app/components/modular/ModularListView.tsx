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
                {/* Left Column */}
                <TouchableOpacity
                    disabled={currentPage === 0}
                    onPress={() => setCurrentPage(prev => prev - 1)}
                    style={styles.navButton}
                >
                    <Text style={[styles.pageButtonText, currentPage === 0 && styles.disabledText]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                {/* Middle Column */}
                <View style={styles.pageTextWrapper}>
                    <Text style={[GlobalStyles.text, { fontSize: 12, textAlign: 'center' }]}>
                        Page {currentPage + 1} of {totalPages}
                    </Text>
                </View>

                {/* Right Column */}
                <TouchableOpacity
                    disabled={currentPage >= totalPages - 1}
                    onPress={() => setCurrentPage(prev => prev + 1)}
                    style={styles.nextButton}
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

    // Pagination
    paginationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginTop: 5,
        width: '100%', // Ensure it spans the full width
    },
    navButton: {
        flex: 1, // Forces button container to take 1/3 of the space
        alignItems: 'flex-start', // Align "Previous" to the left
    },
    nextButton: {
        flex: 1,
        alignItems: 'flex-end', // Align "Next" to the right
    },
    pageTextWrapper: {
        flex: 1, // Forces text container to take 1/3 of the space
        alignItems: 'center', // Centers the text exactly in the middle 1/3
    },
    pageButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.buttonBlue, // Fallback color
    },
    disabledText: {
        opacity: 0.3,
    },
});