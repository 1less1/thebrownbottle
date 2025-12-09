import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import SkeletonPulse from "../SkeletonPulse";
import { Colors } from "@/constants/Colors";

const QuickStatsSkeleton = () => {
    // const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, styles.desktop]}>

            {/* 1st Skeleton Card */}
            <View style={[styles.card, styles.pendingCard]}>
                <View>
                    <SkeletonPulse width={150} height={16} borderRadius={4} backgroundColor={"#fcba5883"}/>
                    <SkeletonPulse width={60} height={44} borderRadius={6} backgroundColor={"#fcba5883"} style={{ marginTop: 10 }} />
                </View>

                <SkeletonPulse width={45} height={45} backgroundColor={"#fcc36e83"} borderRadius={10} />
            </View>

            {/* 2nd Skeleton Card */}
            <View style={[styles.card, styles.shiftCoverCard]}>
                <View>
                    <SkeletonPulse width={150} height={16} backgroundColor={"#a1c3e68a"} borderRadius={4} />
                    <SkeletonPulse width={60} height={44} backgroundColor={"#a1c3e68a"} borderRadius={6} style={{ marginTop: 10 }} />
                </View>

                <SkeletonPulse width={45} height={45} backgroundColor={"#a1c3e68a"} borderRadius={10} />
            </View>

            {/* 3rd Skeleton Card */}
            <View style={[styles.card,styles.timeOffCard]}>
                <View>
                    <SkeletonPulse width={150} height={16} backgroundColor={"#cab1ccb7"} borderRadius={4} />
                    <SkeletonPulse width={60} height={44} backgroundColor={"#cab1ccb7"} borderRadius={6} style={{ marginTop: 10 }} />
                </View>

                <SkeletonPulse width={45} height={45} backgroundColor={"#cab1ccb7"} borderRadius={10} />
            </View>

        </View>
    );
};

export default QuickStatsSkeleton;

const styles = StyleSheet.create({
    container: {
        gap: 8,
        width: '100%',
    },
    desktop: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    // The individual card style needs adjustment for the layout to work smoothly
    card: {
        flex: 1, // Allows cards to take up equal space in a row
        height: 110,
        padding: 18,
        marginBottom: 8,
        marginRight: 2,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.altBorderColor,
    },
    pendingCard: {
        backgroundColor: Colors.bgYellow,
        borderColor: Colors.borderYellow
    },
    shiftCoverCard: {
        backgroundColor: Colors.bgBlue,
        borderColor: Colors.borderBlue
    },
    timeOffCard: {
        backgroundColor: Colors.bgPurple,
        borderColor: Colors.borderPurple
    }
});