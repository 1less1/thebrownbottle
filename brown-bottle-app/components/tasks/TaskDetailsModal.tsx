import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Task } from "@/types/iTask";
import ModularModal from "@/components/modular/ModularModal";
import { Colors } from "@/constants/Colors";
import ModularButton from "../modular/ModularButton";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { StyleSheet } from "react-native";

interface TaskDetailsModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onComplete?: (task: Task) => void;
  actionLabel?: string;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  visible,
  task,
  onClose,
  onComplete,
  actionLabel
}) => {
  if (!task) return null;

  return (
    <ModularModal visible={visible} onClose={onClose}>
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {task.title}
        </Text>

        {task.recurring_task_id && (
          <Text style={styles.recurring}>
            Recurring Task
          </Text>
        )}

        <Text style={{ color: Colors.gray }}>
          Due: {task.due_date}
        </Text>

        <Text>
          {task.description}
        </Text>

        {task.last_modified_name && task.last_modified_at && (
          <View>
            <Text style={{ color: Colors.gray }}>
              Completed by{" "}
              <Text style={{ fontWeight: "bold" }}>
                {task.last_modified_name}
              </Text>
            </Text>

            <Text style={{ color: Colors.gray }}>
              on {task.last_modified_at}
            </Text>
          </View>
        )}

        <View style={styles.buttonRowContainer}>
          <ModularButton
            text={actionLabel || "Submit"}
            textStyle={{ color: "white" }}
            style={GlobalStyles.submitButton}
            onPress={() => onComplete && onComplete(task)}
          />

          <ModularButton
            text="Cancel"
            textStyle={{ color: 'gray' }}
            style={GlobalStyles.cancelButton}
            onPress={onClose}
          />
        </View>

      </View>
    </ModularModal>
  );
};

export default TaskDetailsModal;

const styles = StyleSheet.create({
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  recurring: {
    backgroundColor: Colors.bgGreen,
    padding: 6,
    borderRadius: 4,
    color: Colors.acceptGreen,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});

