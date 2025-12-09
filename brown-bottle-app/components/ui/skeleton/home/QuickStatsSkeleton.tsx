import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonPulse from "../SkeletonPulse";
import { Colors } from "@/constants/Colors";

const QuickStatsSkeleton = () => {
    return (
        <>
            <View style={styles.card}>
                <View>
                    <SkeletonPulse width={150} height={16} borderRadius={4} />
                    <SkeletonPulse width={60} height={44} borderRadius={6} style={{ marginTop: 10 }} />
                </View>

                <SkeletonPulse width={45} height={45} borderRadius={10} />
            </View>

        </>
    );
};

export default QuickStatsSkeleton;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 110,
        padding: 18,
        marginBottom: 8,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.altBorderColor,
        marginLeft: 8,
        marginRight: 8,
    },
});
