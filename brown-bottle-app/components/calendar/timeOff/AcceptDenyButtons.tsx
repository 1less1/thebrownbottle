import React from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConfirm } from '@/hooks/useConfirm';
import { ButtonProps } from '@/types/iTimeOff';

const AcceptDenyButtons: React.FC<ButtonProps> = ({
  employee_id,
  employee_name,
  request_id,
  status,
  onApproveRequest,
  onDenyRequest,
}) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;
  const { confirm } = useConfirm();

  const handleAccept = async () => {
    const ok = await confirm(
      'Confirm Approval',
      `Approve time-off for ${employee_name}?`
    );
    if (!ok) return;

    console.log(`Approved request ${request_id} for ${employee_name}`);
    await onApproveRequest(employee_id, employee_name, request_id, 'Accepted');
  };

  const handleDeny = async () => {
    const ok = await confirm(
      'Confirm Denial',
      `Deny time-off for ${employee_name}?`
    );
    if (!ok) return;

    console.log(`Denied request ${request_id} for ${employee_name}`);
    await onDenyRequest(employee_id, employee_name, request_id, 'Denied');
  };

  return (
    <View
      style={[
        styles.buttonGroup,
        { flexDirection: isSmallScreen ? 'column' : 'row' },
      ]}
    >
      {/* Approve Button */}
      <TouchableOpacity
        onPress={handleAccept}
        style={[
          styles.content,
          {
            marginRight: isSmallScreen ? 0 : 10,
            backgroundColor: '#c2ffba',
            borderColor: '#5ccf4c',
          },
        ]}
      >
        <Ionicons name="checkmark-circle" size={20} color="#409135" />
      </TouchableOpacity>
      {/* Deny Button */}
      <TouchableOpacity
        onPress={handleDeny}
        style={[
          styles.content,
          {
            marginTop: isSmallScreen ? 10 : 0,
            backgroundColor: '#f8d7da',
            borderColor: 'red',
          },
        ]}
      >
        <Ionicons name="close-circle" size={20} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
});

export default AcceptDenyButtons;
