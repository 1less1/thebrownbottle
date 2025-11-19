import React from "react";
import { View, Text } from "react-native";
import { GlobalStyles } from "@/constants/GlobalStyles";

type Props = {
    status: "Pending" | "Accepted" | "Denied";
};

export default function StatusBadge({ status }: Props) {
    // Map status to the corresponding styles
    const containerStyle =
        status === "Accepted"
            ? GlobalStyles.acceptedBadge
            : status === "Denied"
            ? GlobalStyles.deniedBadge
            : GlobalStyles.pendingBadge;

    const textStyle =
        status === "Accepted"
            ? GlobalStyles.acceptedText
            : status === "Denied"
            ? GlobalStyles.deniedText
            : GlobalStyles.pendingText;

    return (
        <View style={containerStyle}>
            <Text style={textStyle}>{status}</Text>
        </View>
    );
    
};
