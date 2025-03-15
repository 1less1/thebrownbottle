import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for the checkbox
import Card from '@/components/Card';
import AltCard from '@/components/AltCard';
import { Colors } from '@/constants/Colors';

interface CheckBoxCardProps {
    text: String;
}

const CheckBoxCard: React.FC<CheckBoxCardProps> = ({text}) => {
    // States for Checked and Unchecked Cards
    const [checked, setChecked] = useState(false); // All cards start unchecked --> that is why useState is false!

    const toggleCheck = () => {
      setChecked(!checked);
    };

    return (

        <TouchableOpacity onPress={toggleCheck} activeOpacity={0.8}>

            <AltCard style={[styles.checkBoxCard, checked && styles.checkedCard]}>

                <Text style={styles.text}>{text}</Text>
                
                <Ionicons
                    name={checked ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="black"
                    style={styles.checkbox}
                />

                </AltCard>

      </TouchableOpacity>


    );

};

const styles = StyleSheet.create({
    checkBoxCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Ensures the checkbox stays on the right
      width: '100%',
      backgroundColor: Colors.lightTan,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    checkedCard: {
      opacity: 0.5, // Reduce opacity when checked
    },
    text: {
      color: 'black',
      fontSize: 14,
      flexShrink: 1, // Ensures long text doesn't push checkbox offscreen
      textAlign: 'left',
    },
    checkbox: {
      marginLeft: 10,
    },
  });
  
  export default CheckBoxCard;