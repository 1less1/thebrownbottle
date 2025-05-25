import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const GlobalStyles = StyleSheet.create({
    // Text Styles
    pageHeader: {
        textAlign: 'left', 
        fontSize: 36, 
        color: 'black', 
        fontWeight: 'bold', 
        marginLeft: 30, 
        marginBottom:10
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
    smallText: {
        color: 'black',
        fontSize: 12,
        fontStyle: 'normal',
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
    inputLabelText: {
        color: 'black',
        fontSize: 16,
        marginRight: 5,
        fontStyle: 'normal',
        alignSelf: 'center',
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
    boldAltText: {
        color: 'gray',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 'bold',
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
        color: 'red',
    },
    modalTitle: {
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'black',
    },

    // Component Styles
    input: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        backgroundColor: Colors.inputBG,
    },
    submitButton: {
        backgroundColor: Colors.buttonBG,
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

});
