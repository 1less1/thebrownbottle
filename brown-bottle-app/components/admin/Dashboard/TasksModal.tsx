import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import SectionDropdown from '@/components/SectionDropdown';
import HorizontalCheckboxList from '@/components/modular/HorizontalCheckboxList';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import DatePickerModal from '@/components/modular/DatePickerModal';

import { User } from '@/utils/SessionContext';
import { insertRecurringTask, insertTask } from '@/utils/api/task';
import { isValidDate } from '@/utils/helper';


interface TasksModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

const TasksModal: React.FC<TasksModalProps> = ({ visible, onClose, user }) => {

  const [selectedSectionId, setSelectedSectionId] = useState<number>(1);
  const [selectedSectionName, setSelectedSectionName] = useState<string>("");

  const handleSectionSelect = (sectionId: number, sectionName: string) => {
      setSelectedSectionId(sectionId);
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [due_date, setDueDate] = useState(dayjs().format('YYYY-MM-DD')); // Default to today's date
  const [isRecurring, setIsRecurring] = useState(false);
  const [start_date, setStartDate] =  useState(dayjs().format('YYYY-MM-DD')); // Default to today's date

  // end_date allowed to be NULL!
  const [end_date, setEndDate] = useState<string | null>(dayjs().add(1, 'day').format('YYYY-MM-DD')); // Default to tomorrow's date
  const [noEndDate, setNoEndDate] = useState(false);

  const [DPVisibleOne, setDPVisibleOne] = useState(false);
  const [DPVisibleTwo, setDPVisibleTwo] = useState(false);
  const [DPVisibleThree, setDPVisibleThree] = useState(false);

  const dayMappings = {
    Mon: 'mon',
    Tue: 'tue',
    Wed: 'wed',
    Thu: 'thu',
    Fri: 'fri',
    Sat: 'sat',
    Sun: 'sun',
  };

  const [recurrence_days, setRecurrenceDays] = useState<string[]>([]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(dayjs().format('YYYY-MM-DD'));
    setSelectedSectionId(1);
    setSelectedSectionName('');
    setRecurrenceDays([]);
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setEndDate(dayjs().add(1, 'day').format('YYYY-MM-DD'));
    setIsRecurring(false);
    setNoEndDate(false);
    setDPVisibleOne(false);
    setDPVisibleTwo(false);
    setDPVisibleThree(false);
  };

  const handleAssign = async () => {
    // Common checks for title, description, and section
    if (!title.trim() || !description.trim() || selectedSectionId === -1) {
      alert("Please fill in Title, Description, and select a Section!");
      return;
    }

    if (isRecurring) {
      // Validate start_date
      if (!start_date.trim()) {
        alert("Please fill in the Start Date.");
        return;
      }

      if (!isValidDate(start_date)) {
        alert("Please enter the start date in YYYY-MM-DD format.");
        return;
      }

      // Validate end_date only if noEndDate is false
      if (!noEndDate) {
        if (!end_date || !end_date.trim()) {
          alert("Please fill in the End Date or check 'No End Date'.");
          return;
        }
        if (!isValidDate(end_date)) {
          alert("Please enter the end date in YYYY-MM-DD format.");
          return;
        }

        if (dayjs(start_date).isAfter(dayjs(end_date))) {
          alert("Start Date cannot be after End Date.");
          return;
        }
      }

      // Validate recurrence days selection
      if (!recurrence_days || recurrence_days.length === 0) {
        alert("Please select at least one day for recurrence.");
        return;
      }
    } else {
      // Non-recurring task validation
      if (!due_date.trim()) {
        alert("Please fill in the Due Date.");
        return;
      }

      if (!isValidDate(due_date)) {
        alert("Please enter the due date in YYYY-MM-DD format.");
        return;
      }
    }

    try {
      if (isRecurring) {
        await insertRecurringTask(
          Number(user.employee_id),
          title,
          description,
          selectedSectionId,
          recurrence_days,
          start_date,
          noEndDate ? null : end_date // pass null if noEndDate checked
        );
      } else {
        await insertTask(
          Number(user.employee_id),
          title,
          description,
          selectedSectionId,
          due_date
        );
      }

      alert("Task Posted Successfully!");
      console.log("Task Posted Successfully!");

      resetForm();

      onClose();

    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error: Failed to assign task. Please try again.");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  
  
  
  // User Interface Code ---------------------------------------------------------------------------------------
  return (

    <ModularModal visible={visible} onClose={onClose}>


      <Text style={GlobalStyles.modalTitle}>New Task</Text>
      
      {/* Title Input */}
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={[GlobalStyles.input, { marginBottom: 15 }]}  />
      
      {/* Description Input */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[GlobalStyles.input, { marginBottom: 15, height: 100, textAlignVertical: 'top' }]}
      />
      
      {/* Due Date Input */}
      {!isRecurring && (
        <>
          <View style= {{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15, }}>
            <ModularButton 
              text='Choose Due Date'
              textStyle={{ color: 'black' }}
              style={[
                { backgroundColor: 'white', borderColor: Colors.darkTan, borderWidth: 1, flexShrink: 1, paddingHorizontal: 15, }
              ]} 
              onPress={() => setDPVisibleOne(true)}
            />
            <View style={styles.dateContainer}>     
              <Text style={GlobalStyles.text}>Date: </Text>
              <Text style={[GlobalStyles.text, {color: Colors.blue }]}>{due_date}</Text>
            </View>
          </View>

          <DatePickerModal
            visible={DPVisibleOne}
            onClose={() => setDPVisibleOne(false)}
            dateString={due_date}
            onChange={(newDate) => {
              setDueDate(newDate);
              setDPVisibleOne(false);
            }}
          />
        </>
      )}

      {/* Section Dropdown */}
      <View style={{ marginBottom: 15 }}>
        <SectionDropdown selectedSectionId={selectedSectionId} onSectionSelect={handleSectionSelect} labelText="Assign To:" />
      </View>
      
      {/* Recurring Checkbox */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, }}>
        <Pressable onPress={() => setIsRecurring(!isRecurring)} style={{ marginRight: 5 }}>
          <Ionicons
            name={isRecurring ? 'checkbox' : 'square-outline'}
            size={24}
            color={isRecurring ? Colors.selectedBox : Colors.unselectedBox}
          />
        </Pressable>
        <Text style={GlobalStyles.mediumText}>Recurring Task</Text>
      </View>


      {/* Recurring Task Components */}
      {isRecurring && (
        
        <>
          {/* Day Checkboxes */}
          <View style={{ marginBottom: 15 }}>
            <HorizontalCheckboxList
              labelText="Select Days:"
              optionMap={dayMappings}
              onChange={(recurrenceDays) => setRecurrenceDays(recurrenceDays)}
            />
          </View>

          <>
            {/* Start Date Input */}
            <View style= {{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15, }}>
              <ModularButton 
                text='Choose Start Date'
                textStyle={{ color: 'black' }}
                style={[
                  { backgroundColor: 'white', borderColor: Colors.darkTan, borderWidth: 1, flexShrink: 1, paddingHorizontal: 15, }
                ]} 
                onPress={() => setDPVisibleTwo(true)}
              />
              <View style={styles.dateContainer}>     
                <Text style={GlobalStyles.text}>Date: </Text>
                <Text style={[GlobalStyles.text, {color: Colors.blue }]}>{start_date}</Text>
              </View>
            </View>

            <DatePickerModal
              visible={DPVisibleTwo}
              onClose={() => setDPVisibleTwo(false)}
              dateString={start_date}
              onChange={(newDate) => {
                setStartDate(newDate);
                setDPVisibleTwo(false);
              }}
            />
          </>
          
        

          {!noEndDate && (        
            <>
              {/* End Date Input */}  
              <View style= {{ flexDirection: 'row', alignItems: 'center',  gap: 5, marginBottom: 15, }}>
                <ModularButton 
                  text='Choose End Date'
                  textStyle={{ color: 'black' }}
                  style={[
                    { backgroundColor: 'white', borderColor: Colors.darkTan, borderWidth: 1, flexShrink: 1, paddingHorizontal: 15, } 
                  ]} 
                  onPress={() => setDPVisibleThree(true)}
                />
                <View style={styles.dateContainer}>     
                  <Text style={GlobalStyles.text}>Date: </Text>
                  <Text style={[GlobalStyles.text, {color: Colors.blue }]}>{end_date}</Text>
                </View>
              </View>

              {end_date && (
                <DatePickerModal
                  visible={DPVisibleThree}
                  onClose={() => setDPVisibleThree(false)}
                  dateString={end_date}
                  onChange={(newDate) => {
                    setEndDate(newDate);
                    setDPVisibleThree(false);
                  }}
                />
              )}
            </>
          )}

          {/* No End Date Checkbox */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, }}>
            <Pressable
              onPress={() => {
                setNoEndDate(!noEndDate);
                if (!noEndDate) {
                  // Going from false → true, so we are disabling end date
                  setEndDate(null);
                  setDPVisibleThree(false);
                } else {
                  // Going from true → false, re-enable with default date
                  setEndDate(dayjs().add(1, 'day').format('YYYY-MM-DD'));
                }
              }}
              style={{ marginRight: 5 }}
            >
              <Ionicons
                name={noEndDate ? 'checkbox' : 'square-outline'}
                size={24}
                color={noEndDate ? Colors.selectedBox : Colors.unselectedBox}
            />
            </Pressable>
            <Text style={GlobalStyles.mediumText}>No End Date</Text>
          </View>
        </>
      )}


      {/* Assign and Cancel Buttons */}
      <View style={styles.buttonRowContainer }>
          <ModularButton
            text="Assign"
            textStyle={{ color: 'white'}}
            style={GlobalStyles.submitButton}
            onPress={handleAssign}
          />

          <ModularButton
            text="Cancel"
            textStyle={{ color: 'gray'}}
            style={GlobalStyles.cancelButton}
            onPress={handleClose}
          />
      </View>


    </ModularModal>

  );
};

const styles = StyleSheet.create({
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  dateContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    backgroundColor: 'white', 
    borderColor: Colors.borderColor, 
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    textAlignVertical: 'center',
  },
});

export default TasksModal;
