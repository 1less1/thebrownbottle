import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TimeOffModal from './TimeOffModal'; // Adjust the path if needed
import { Colors } from '@/constants/Colors'; 
import Card from '@/components/modular/Card'; 

const TimeOff = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Card style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
      <View style={styles.row}>
        <Text style={styles.noRequests}>No time off requests yet...</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.addButton}>
            <Text style={styles.addText}>Add</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <TimeOffModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',
  },
  noRequests: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: Colors.white, 
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    // Elevation for Android
    elevation: 2,
  },
  addText: {
    color: Colors.black,
    fontSize: 14,
  },
});

export default TimeOff;


