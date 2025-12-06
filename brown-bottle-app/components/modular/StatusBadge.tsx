import React from "react";
import { View, Text } from "react-native";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { Status } from "@/types/iShiftCover";

type Props = {
    status: Status
};

export default function StatusBadge({ status }: Props) {
    // Map status to the corresponding styles
    const containerStyle =
        status === "Accepted"
            ? GlobalStyles.acceptedBadge
            : status === "Denied"
                ? GlobalStyles.deniedBadge
                : status === "Awaiting Approval"
                    ? GlobalStyles.awaitingApprovalBadge
                    : GlobalStyles.pendingBadge;

    const textStyle =
        status === "Accepted"
            ? GlobalStyles.acceptedText
            : status === "Denied"
                ? GlobalStyles.deniedText
                : status === "Awaiting Approval"
                    ? GlobalStyles.awaitingApprovalText
                    : GlobalStyles.pendingText;

    return (
        <View style={containerStyle}>
            <Text style={textStyle}>{status}</Text>
        </View>
    );

};
