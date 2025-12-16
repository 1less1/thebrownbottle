import React from 'react'
import { View, StyleSheet } from "react-native";
import SkeletonPulse from "../SkeletonPulse";
import { Colors } from "@/constants/Colors";

const NextShiftSkeleton = () => {
    return (
        <View>
            <View style={[styles.card]}>
                <View>
                    <SkeletonPulse width={150} height={16} borderRadius={4} backgroundColor='#cbcbcb92' />
                    <SkeletonPulse width={60} height={24} borderRadius={6}  backgroundColor='#cbcbcb92' style={{ marginTop: 10 }} />
                    <SkeletonPulse width={125} height={16} borderRadius={6}  backgroundColor='#cbcbcb92' style={{ marginTop: 10 }} />
                </View>

                <SkeletonPulse width={45} height={45}  backgroundColor='#cbcbcb92' borderRadius={10} />
            </View>
        </View>
    )
}

export default NextShiftSkeleton

const styles = StyleSheet.create({
    container: {
        gap: 8,
        width: '100%',
    },
    desktop: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        height: 110,
        minWidth: 215,
        backgroundColor: Colors.bgGray,
        padding: 18,
        marginBottom: 8,
        marginRight: 2,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.borderColor,
        flexBasis: '32%'
    },
});