import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Card from "@/components/Card";
import { Colors } from '@/constants/Colors'; 

import CheckBoxCard from '@/components/tasks/CheckBoxCard';

const TaskList = () => {
  const tasks = [
      { id: 1, text: 'Stock the meat shipment in the freezer. Sort by expiration date and cut.' },
      { id: 2, text: 'Clean and sanitize all cutting boards after use.' },
      { id: 3, text: 'Ensure all vegetables are prepped and stored in the fridge.' },
      { id: 4, text: 'Check the inventory of dry goods and reorder if necessary.' },
      { id: 5, text: 'Prepare sauces for the dinner shift and label them with the date.' },
      { id: 6, text: 'Sharpen all knives and check for any needed repairs.' },
    ];

  return (

    <Card style={styles.container}>

      {tasks.map((task) => (

        <View // Wrapper for the CheckBoxCard
          key={task.id} 
          style={{ 
            width: '100%', 
            marginTop: 6, 
            marginBottom: task.id === tasks.length ? 6 : 0, // Add marginBottom value of 6 to ONLY last item
          }}>
          
          <CheckBoxCard text={task.text} />
        
        </View>

      ))}

    </Card>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4, // Compensate for the vertical margin of 6 for the first and last entry of the tasks list!
  },
});

export default TaskList;