import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import SectionDropdown from '@/components/SectionDropdown';
import HorizontalCheckboxList from '@/components/modular/HorizontalCheckboxList';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';
import CalendarWidget from '@/components/calendar/CalendarWidget';

import { User } from '@/utils/SessionContext';
import { insertRecurringTask, insertTask } from '@/routes/task';
import { isValidDate } from '@/utils/generalHelpers';
import { formatDateWithYear } from '@/utils/dateTimeHelpers';

interface TasksModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

const TasksModal: React.FC<TasksModalProps> = ({ visible, onClose, user }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<number>(1);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [due_date, setDueDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [isRecurring, setIsRecurring] = useState(false);

  const [start_date, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [end_date, setEndDate] = useState<string | null>(
    dayjs().add(1, 'day').format('YYYY-MM-DD')
  );
  const [noEndDate, setNoEndDate] = useState(false);

  /* modal visibility */
  const [duePickerVisible, setDuePickerVisible] = useState(false);
  const [rangePickerVisible, setRangePickerVisible] = useState(false);

  /* temp state for confirm flow */
  const [tempDueDate, setTempDueDate] = useState(due_date);
  const [tempStartDate, setTempStartDate] = useState(start_date);
  const [tempEndDate, setTempEndDate] = useState<string | null>(end_date);

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
    setRecurrenceDays([]);
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setEndDate(dayjs().add(1, 'day').format('YYYY-MM-DD'));
    setIsRecurring(false);
    setNoEndDate(false);
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

  return (

    <ModularModal visible={visible} onClose={onClose}>


      <Text style={GlobalStyles.modalTitle}>New Task</Text>

      {/* Title Input */}
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} placeholderTextColor={'gray'} style={[GlobalStyles.input, { marginBottom: 15 }]} />

      {/* Description Input */}
      <TextInput
        placeholder="Description"
        placeholderTextColor={'gray'}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[GlobalStyles.input, { marginBottom: 15, height: 100, textAlignVertical: 'top' }]}
      />

      {/* Due Date Input */}
      {!isRecurring && (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15, }}>
            <ModularButton
              text="Choose Due Date"
              textStyle={{ color: 'black' }}
              style={[
                { backgroundColor: 'white', borderColor: Colors.darkTan, borderWidth: 1, flexShrink: 1, paddingHorizontal: 15, }
              ]}
              onPress={() => {
                setTempDueDate(due_date);
                setDuePickerVisible(true);
              }}
            />

            <View style={styles.dateContainer}>
              <Text style={GlobalStyles.text}>
                {formatDateWithYear(due_date)}
              </Text>
            </View>
          </View>

          <ModularModal
            visible={duePickerVisible}
            onClose={() => {
              setTempDueDate(due_date);
              setDuePickerVisible(false);
            }}
          >
            <CalendarWidget
              mode="picker"
              pickerType="single"
              showShifts={false}
              initialDate={tempDueDate}
              onSelectDate={({ date }) => setTempDueDate(date)}
            />

            <View style={[styles.dateContainer, { marginTop: 10 }]}>
              <Text style={GlobalStyles.text}>Selected: </Text>
              <Text style={[GlobalStyles.semiBoldText, { color: Colors.blue }]}>
                {formatDateWithYear(tempDueDate)}
              </Text>
            </View>

            <View style={styles.buttonRowContainer}>
              <ModularButton
                text="Confirm"
                style={GlobalStyles.submitButton}
                textStyle={{ color: 'white' }}
                onPress={() => {
                  setDueDate(tempDueDate);
                  setDuePickerVisible(false);
                }}
              />
              <ModularButton
                text="Cancel"
                style={GlobalStyles.cancelButton}
                textStyle={{ color: 'gray' }}
                onPress={() => {
                  setTempDueDate(due_date);
                  setDuePickerVisible(false);
                }}
              />
            </View>
          </ModularModal>
        </>
      )}

      {/* -------- Section -------- */}
      <View style={{ marginBottom: 15 }}>
        <SectionDropdown
          selectedSectionId={selectedSectionId}
          onSectionSelect={setSelectedSectionId}
          labelText="Assign To:"
        />
      </View>

      {/* -------- Recurring Toggle -------- */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <Pressable onPress={() => setIsRecurring(!isRecurring)} style={{ marginRight: 5 }}>
          <Ionicons
            name={isRecurring ? 'checkbox' : 'square-outline'}
            size={24}
            color={isRecurring ? Colors.selectedBox : Colors.unselectedBox}
          />
        </Pressable>
        <Text style={GlobalStyles.mediumText}>Recurring Task</Text>
      </View>

      {/* -------- Recurring -------- */}
      {isRecurring && (
        <>
          <HorizontalCheckboxList
            labelText="Select Days:"
            optionMap={dayMappings}
            onChange={setRecurrenceDays}
          />

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            <ModularButton
              text="Choose Range"
              textStyle={{ color: 'black' }}
              style={[
                { backgroundColor: 'white', borderColor: Colors.darkTan, borderWidth: 1, flexShrink: 1,  }
              ]}
              onPress={() => {
                setTempStartDate(start_date);
                setTempEndDate(end_date);
                setRangePickerVisible(true);
              }}
            />

            <View style={styles.dateContainer}>
              <Text style={GlobalStyles.text}>
                {start_date && end_date
                  ? `${formatDateWithYear(start_date)} → ${formatDateWithYear(end_date)}`
                  : `${formatDateWithYear(start_date)} →`}
              </Text>
            </View>
          </View>

          <ModularModal
            visible={rangePickerVisible}
            onClose={() => {
              setTempStartDate(start_date);
              setTempEndDate(end_date);
              setRangePickerVisible(false);
            }}
          >
            <CalendarWidget
              mode="picker"
              pickerType="range"
              showShifts={false}
              onSelectRange={({ startDate, endDate }) => {
                setTempStartDate(startDate);
                setTempEndDate(endDate);
              }}
            />

            <View style={[styles.dateContainer, { marginTop: 10 }]}>
              <Text style={GlobalStyles.text}>Selected: </Text>
              <Text style={[GlobalStyles.semiBoldText, { color: Colors.blue }]}>
                {tempStartDate && tempEndDate
                  ? `${formatDateWithYear(tempStartDate)} → ${formatDateWithYear(tempEndDate)}`
                  : tempStartDate
                    ? `${formatDateWithYear(tempStartDate)} →`
                    : ''}
              </Text>
            </View>

            <View style={styles.buttonRowContainer}>
              <ModularButton
                text="Confirm"
                style={GlobalStyles.submitButton}
                textStyle={{ color: 'white' }}
                onPress={() => {
                  setStartDate(tempStartDate);
                  setEndDate(noEndDate ? null : tempEndDate);
                  setRangePickerVisible(false);
                }}
              />
              <ModularButton
                text="Cancel"
                style={GlobalStyles.cancelButton}
                textStyle={{ color: 'gray' }}
                onPress={() => {
                  setTempStartDate(start_date);
                  setTempEndDate(end_date);
                  setRangePickerVisible(false);
                }}
              />
            </View>
          </ModularModal>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Pressable
              onPress={() => {
                setNoEndDate(!noEndDate);
                if (!noEndDate) setEndDate(null);
                else setEndDate(dayjs().add(1, 'day').format('YYYY-MM-DD'));
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
      <View style={styles.buttonRowContainer}>
        <ModularButton
          text="Assign"
          textStyle={{ color: 'white' }}
          style={GlobalStyles.submitButton}
          onPress={handleAssign}
        />
        <ModularButton
          text="Cancel"
          style={GlobalStyles.cancelButton}
          onPress={onClose}
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
    marginTop: 15,
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
  },
});

export default TasksModal;
