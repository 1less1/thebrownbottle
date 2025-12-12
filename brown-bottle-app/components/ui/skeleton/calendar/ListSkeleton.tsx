import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import SkeletonPulse from '../SkeletonPulse'

export const ListSkeleton = () => {
    return (
        <View style={styles.listContainer}>
            <View style={styles.listItem}>
                <View style={{ flexDirection: "row", position: "relative" }}>
                    <SkeletonPulse width={"35%"} height={12} />
                    <View style={{ position: "absolute", top: 0, right: 0 }}>
                        <SkeletonPulse width={75} />
                    </View>
                </View>
                <SkeletonPulse width={"55%"} height={20} style={{ marginTop: 10 }} />
                <SkeletonPulse width={"25%"} height={15} style={{ marginTop: 10 }} />
            </View>
        </View>

    )
}

export default ListSkeleton
const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        maxWidth: "100%",
    },
    listItem: {
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
