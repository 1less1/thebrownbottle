import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import ModularModal from "@/components/modular/ModularModal";
import ModularButton from "@/components/modular/ModularButton";

import TaskModalContent from "@/components/tasks/Templates/TaskModalContent";

import { Task } from "@/types/iTask";

interface Props {
  task: Task;
  mode: "active" | "completed";
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  loading: boolean;
}

const EmpTaskModal: React.FC<Props> = ({ task, mode, visible, onClose, onSubmit, loading }) => {

  const modeConfig = {
    active: {
      text: "Mark Complete",
      textColor: Colors.green,
      style: [GlobalStyles.borderButton, styles.completeButton],
    },
    completed: {
      text: "Mark Incomplete",
      textColor: Colors.red,
      style: [GlobalStyles.borderButton, styles.incompleteButton],
    },
  };

  const config = modeConfig[mode];

  return (

    <ModularModal visible={visible} onClose={onClose}>

      {/* Modal Content */}
      <TaskModalContent task={task} />

      {/* Buttons */}
      <View style={GlobalStyles.buttonRowContainer}>
        {/* Action Button */}
        <ModularButton
          text={config.text}
          textStyle={{ color: config.textColor }}
          style={config.style}
          onPress={() => onSubmit(task)} // Pass the task back to the parent
          enabled={!loading}
        />
        
        {/* Cancel Button */}
        <ModularButton
          text="Cancel"
          textStyle={{ color: 'gray' }}
          style={[GlobalStyles.cancelButton, { flexGrow: 1 }]}
          onPress={onClose}
        />
      </View>

    </ModularModal>

  );
};

const styles = StyleSheet.create({
  // Buttons
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",   // pushes both buttons to the right
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  incompleteButton: {
    flexGrow: 1,
    backgroundColor: Colors.bgRed,
    borderColor: Colors.borderRed,
    alignItems: "center"
  },
  completeButton: {
    flexGrow: 1,
    backgroundColor: Colors.bgGreen,
    borderColor: Colors.borderGreen,
    alignItems: "center"
  },
});

export default EmpTaskModal;

