import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';


const AddEmp = () => {
    const [modalVisible, setModalVisible] = useState(false);

    // Toggle modal visibility
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (

        <View style={styles.container}>
            {/* Clickable Content */}
            <TouchableOpacity onPress={toggleModal} style={styles.content}>
                <Ionicons name="person-add" size={30} color="black" style={styles.icon} />
                <Text style={[GlobalStyles.boldText, styles.iconText]}>Add Employee</Text>
            </TouchableOpacity>

            {/* Insert Modal Code Here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'column',
        padding: 15,
        height: 150,
        justifyContent: 'center',
    },
    icon: {
        marginBottom: 8,
    },
    iconText: {
        textAlign: 'center',
        flexWrap: 'wrap',
    }
});

export default AddEmp;
