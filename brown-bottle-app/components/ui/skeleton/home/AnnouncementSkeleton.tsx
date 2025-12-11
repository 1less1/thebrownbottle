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
                        <SkeletonPulse width={160} height={18} borderRadius={4} backgroundColor="#d0d0d08b" />
                        <SkeletonPulse width={70} height={20} borderRadius={6} backgroundColor="#d0d0d08b" />
                    </View>

                    <SkeletonPulse width="85%" height={24} borderRadius={4} backgroundColor="#d0d0d08b" style={{ marginTop: 10 }} />
                    {/* <SkeletonPulse width="60%" height={16} borderRadius={4} backgroundColor="#d0d0d0a8" style={{ marginTop: 6 }} /> */}
                    <SkeletonPulse width={90} height={12} borderRadius={4} backgroundColor="#d0d0d08b" style={{ marginTop: 10 }} />

                    <SkeletonPulse width={100} height={32} borderRadius={6} backgroundColor="#d0d0d08b" style={{ marginTop: 12 }} />

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


