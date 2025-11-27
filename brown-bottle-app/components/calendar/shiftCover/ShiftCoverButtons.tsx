import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ShiftCoverButtonsProps } from "@/types/iShiftCover";
import { useWindowDimensions } from "react-native";

export const ShiftCoverButtons: React.FC<ShiftCoverButtonsProps> = ({
  request_id,
  onApprove,
  onDeny,
  disabled = false,  // default value
}) => {

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  return (
    <View
      style={[
        styles.buttonGroup,
        { flexDirection: isSmallScreen ? 'column' : 'row' },
      ]}
    >
      {/* Approve Button */}
      <TouchableOpacity
        onPress={() => onApprove(request_id)}
        disabled={disabled}
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
        onPress={() => onDeny(request_id)}
        disabled={disabled}
        style={[
          styles.content,
          {
            marginTop: isSmallScreen ? 10 : 0,
            backgroundColor: '#f8d7da',
            borderColor: 'red',
            opacity: disabled ? 0.5 : 1, // <-- feedback
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
