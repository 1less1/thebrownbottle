import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import ModularModal from "@/components/modular/ModularModal";
import ModularButton from "@/components/modular/ModularButton";

import TaskModalContent from "@/components/tasks/Templates/TaskModalContent";

import { Task } from "@/types/iTask";

interface ModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  actionLabel?: string;
}

const TaskActionModal: React.FC<ModalProps> = ({
  task,
  visible,
  onClose,
  onSubmit,
  actionLabel,
}) => {

  if (!task) return null;

  return (

    <ModularModal visible={visible} onClose={onClose}>

      <TaskModalContent task={task} />

      {/* Buttons */}
      <View style={GlobalStyles.buttonRowContainer}>
        <ModularButton
          text={actionLabel || "Submit"}
          textStyle={{ color: "white" }}
          style={[GlobalStyles.submitButton, { flex: 1 }]}
          onPress={() => onSubmit(task)}
        />

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

export default TaskActionModal;

const styles = StyleSheet.create({
});

