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
      style: [GlobalStyles.borderButton, styles.completeButton],
      icon: "checkmark-outline" as const,
      color: Colors.green,
    },
    completed: {
      style: [GlobalStyles.borderButton, styles.incompleteButton],
      icon: "close-outline" as const,
      color: Colors.red,
    },
  };

  const config = modeConfig[mode];

  return (

    <ModularModal visible={visible} onClose={onClose}>

      {/* Modal Content */}
      <TaskModalContent task={task} />

      {/* Buttons */}
      <View style={GlobalStyles.buttonRowContainer}>
        <TouchableOpacity
          style={config.style}
          onPress={() => onSubmit(task)} // Pass the task back to the parent
          disabled={loading}
        >
          <Ionicons name={config.icon} size={20} color={config.color} />
        </TouchableOpacity>

        <ModularButton
          text="Cancel"
          textStyle={{ color: 'gray' }}
          style={[GlobalStyles.cancelButton, { flex: 1 }]}
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
    flex: 1,
    backgroundColor: Colors.bgRed,
    borderColor: Colors.borderRed,
    alignItems: "center"
  },
  completeButton: {
    flex: 1,
    backgroundColor: Colors.bgGreen,
    borderColor: Colors.borderGreen,
    alignItems: "center"
  },
});

export default EmpTaskModal;

