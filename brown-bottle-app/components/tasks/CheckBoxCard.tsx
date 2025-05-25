import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for the checkbox

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import AltCard from '@/components/modular/AltCard';

import { format } from 'date-fns';


interface CheckBoxCardProps {
  value: any;
  title: string;
  description: string;
  dueDate: string;
  checked: boolean;
  onCheckChange: (value: any, checked: boolean) => void;
}
const CheckBoxCard: React.FC<CheckBoxCardProps> = ({ title, description, dueDate, value, checked, onCheckChange, }) => {
  const toggleCheck = () => onCheckChange(value, !checked);

    return (
    <TouchableOpacity onPress={toggleCheck} activeOpacity={0.8}>
      <AltCard style={[styles.checkBoxCard, checked && styles.checkedCard]}>

        <View style={styles.cardContent}>
          <Text style={[GlobalStyles.text, { flexShrink: 1}]}>{title}</Text>
        </View>

        <Ionicons
          name={checked ? 'checkbox' : 'square-outline'}
          size={24}
          color="black"
          style={{ marginLeft: 10}}
        />

      </AltCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    checkBoxCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: Colors.white,
      borderColor: Colors.lightTan,
      borderWidth: 2,
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      margin: 6,
      alignSelf: 'center'
    },
    checkedCard: {
      opacity: 0.5, // Reduce opacity when checked
    },
    cardContent: {
      flexDirection: 'column'
    },
    text: {
      color: 'black',
      fontSize: 14,
      flexShrink: 1, // Ensures long text doesn't push checkbox offscreen
      textAlign: 'left',
    },
  });
  
  export default CheckBoxCard;