import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import SkeletonPulse from '../SkeletonPulse'

const ProfileCardSkeleton = () => {
    return (
        <View style={styles.profileContainer}>
            {/* Profile circle */}
            <View style={styles.row}>
                <SkeletonPulse width={100} height={100} borderRadius={64} backgroundColor='#f6f6f6ff' />

                {/* Name email, tag */}
                <View style={styles.infoWrapper}>
                    <SkeletonPulse width={100} height={24} backgroundColor='#f6f6f6ff' />
                    <SkeletonPulse width={160} height={15} style={{ marginTop: 10 }} backgroundColor='#f6f6f6ff' />
                    <SkeletonPulse width={60} height={18} borderRadius={24} style={{ marginTop: 10 }} backgroundColor='#f6f6f6ff' />
                </View>

            </View>
        </View>
    )
}

export default ProfileCardSkeleton
const styles = StyleSheet.create({
    profileContainer: {
        width: "100%",
        minHeight: 260,
        paddingVertical: 25,
        paddingHorizontal: 20,
        backgroundColor: Colors.mediumTan,
        borderWidth: 1,
        borderColor: Colors.altBorderColor,
        justifyContent: "center",
        borderRadius: 14,
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    infoWrapper: {
        marginLeft: 15,
        flexShrink: 1
    },
});
