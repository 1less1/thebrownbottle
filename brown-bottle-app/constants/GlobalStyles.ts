import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const GlobalStyles = StyleSheet.create({
    // Text Styles
    pageHeader: {
        textAlign: 'left',
        fontSize: 36,
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 30,
        marginBottom: 10
    },
    headerText: {
        color: 'black',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    floatingHeaderText: {
        color: 'black',
        textAlign: 'left',
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: "bold",
        marginBottom: 8
    },
    semiBoldSmallText: {
        color: 'black',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '600',
    },
    boldSmallText: {
        color: 'black',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    smallText: {
        color: 'black',
        fontSize: 12,
        fontStyle: 'normal',
    },
    semiBoldText: {
        color: 'black',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
    },
    boldText: {
        color: 'black',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    text: {
        color: 'black',
        fontSize: 14,
        fontStyle: 'normal',
    },
    linkText: {
        color: Colors.blue,
        fontSize: 14,
        fontStyle: 'normal',
        textDecorationLine: 'underline',
    },
    inputLabelText: {
        color: 'black',
        fontSize: 16,
        marginRight: 5,
        fontStyle: 'normal',
        alignSelf: 'flex-start',
    },
    semiBoldMediumText: {
        color: 'black',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
    },
    boldMediumText: {
        color: 'black',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    mediumText: {
        color: 'black',
        fontSize: 16,
        fontStyle: 'normal',
    },
    semiBoldLargeText: {
        color: 'black',
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: '600',
    },
    boldLargeText: {
        color: 'black',
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    largeText: {
        color: 'black',
        fontSize: 18,
        fontStyle: 'normal',
    },
    semiBoldSmallAltText: {
        color: 'gray',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '600',
    },
    smallAltText: {
        color: 'gray',
        fontSize: 12,
        fontStyle: 'normal',
    },
    altText: {
        color: 'gray',
        fontSize: 14,
        fontStyle: 'normal',
    },
    semiBoldAltText: {
        color: 'gray',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
    },
    boldAltText: {
        color: 'gray',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    semiBoldMediumAltText: {
        color: 'gray',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
    },
    mediumAltText: {
        color: 'gray',
        fontSize: 16,
        fontStyle: 'normal',
    },
    loadingText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: 'gray',
    },
    errorText: {
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 400,
        color: Colors.errorRed,
    },
    modalTitle: {
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'black',
    },

    // Component Styles
    pageHeaderContainer: {
        width: '100%',
        paddingTop: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.altBorderColor,
    },
    loadingContainer: {
        width: '100%',
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        flexGrow: 1,
        padding: 8,
        borderRadius: 4,
    },
    input: {
        flexShrink: 1,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        backgroundColor: Colors.inputBG,
    },
    dropdownButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        padding: 10,
        backgroundColor: Colors.white,
        borderRadius: 6,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    buttonRowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: Colors.buttonBG,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    acceptButton: {
        backgroundColor: Colors.bgGreen,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: Colors.bgRed,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: Colors.cancelButtonBG,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modernButton: {
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: Colors.altBorderColor,
        borderRadius: 5,
        borderWidth: 1,
    },

    // Badge Styles
    acceptedBadge: {
        backgroundColor: Colors.bgGreen,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    acceptedText: {
        color: Colors.acceptGreen,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    deniedBadge: {
        backgroundColor: Colors.bgRed,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    deniedText: {
        color: Colors.denyRed,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    pendingBadge: {
        backgroundColor: Colors.bgYellow,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    pendingText: {
        color: Colors.pendingYellow,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    awaitingApprovalBadge: {
        backgroundColor: Colors.badgeGray,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    awaitingApprovalText: {
        color: Colors.darkGray,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    standardBadge: {
        backgroundColor: Colors.badgeGray,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    standardBadgeText: {
        color: Colors.darkGray,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    // Ishimwe edit below!!!
    awaitingApproval: {
        color: "#8b8b8bff",
        backgroundColor: "#e3e5e6ff",
        fontSize: 10,
        padding: 4,
        borderRadius: 4,
    }
});
