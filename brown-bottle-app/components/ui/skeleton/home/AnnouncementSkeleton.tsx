import React from 'react'
import { View, StyleSheet } from 'react-native'
import SkeletonPulse from '../SkeletonPulse'
import { Colors } from '@/constants/Colors'

const AnnouncementSkeleton = () => {
    return (
        <>
            <View style={styles.listItem}>
                <View style={styles.card}>

                    <View style={styles.header}>
                        <SkeletonPulse width={160} height={18} borderRadius={4} backgroundColor="#e3e5e6ff" />
                        <SkeletonPulse width={50} height={20} borderRadius={4} backgroundColor="#e3e5e6ff" />
                    </View>

                    <SkeletonPulse width="85%" height={24} borderRadius={4} backgroundColor="#e3e5e6ff" style={{ marginTop: 10 }} />
                    <SkeletonPulse width={90} height={12} borderRadius={4} backgroundColor="#e3e5e6ff" style={{ marginTop: 10 }} />

                    <SkeletonPulse width={110} height={26} borderRadius={6} backgroundColor="#e3e5e6ff" style={{ marginTop: 12 }} />

                </View>

            </View>
        </>
    )
}

export default AnnouncementSkeleton

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: Colors.bgGray,
        padding: 12,
        width: '95%',
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        marginBottom: 5,
        marginRight: 10,
        marginLeft: 10
    },
    card: {
        flexDirection: "column",
        width: "100%"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%",
    }
});


