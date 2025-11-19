import React from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConfirm } from '@/hooks/useConfirm';
import { ButtonProps } from '@/types/iTimeOff';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

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
            backgroundColor: Colors.bgGreen,
            borderColor: Colors.acceptGreen,
          },
        ]}
      >
        <Ionicons name="checkmark-circle" size={20} color={Colors.acceptGreen} />
      </TouchableOpacity>
      {/* Deny Button */}
      <TouchableOpacity
        onPress={handleDeny}
        style={[
          styles.content,
          {
            marginTop: isSmallScreen ? 10 : 0,
            backgroundColor: Colors.bgRed,
            borderColor: Colors.denyRed,
          },
        ]}
      >
        <Ionicons name="close-circle" size={20} color={Colors.denyRed} />
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
