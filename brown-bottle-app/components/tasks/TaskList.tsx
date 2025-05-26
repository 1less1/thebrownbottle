import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors'; 
import { GlobalStyles } from '@/constants/GlobalStyles';

import { Task } from '@/types/api';
import CheckBoxCard from '@/components/tasks/CheckBoxCard';

interface TaskListProps {
  tasks: Task[];
  checkedTasks: number[];
  onCheckChange: (taskId: number, checked: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, checkedTasks, onCheckChange }) => {
  
  return (
    
    <View style={{ width: '100%' }}>
      {tasks.map((task) => (
        <CheckBoxCard
          key={task.task_id}
          task={task}
          checked={checkedTasks.includes(task.task_id)}
          onCheckChange={onCheckChange}
        />
      ))}
    </View>

  );
};


const styles = StyleSheet.create({
});

export default TaskList;
