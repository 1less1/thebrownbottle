import { View, Text, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';;

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';

import ShiftCalendar from '@/components/calendar/ShiftCalendar/ShiftCalendar';
import EmpSCR from '@/components/calendar/ShiftCover/EmpSCR';
import TimeOff from '@/components/calendar/TimeOff/TimeOff';

import LoadingCircle from '@/components/modular/LoadingCircle';

import { useSession } from '@/utils/SessionContext'

interface Tab {
    key: string;
    title: string;
    component: React.ReactNode;
}

const CalendarPage = () => {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const { user } = useSession();
  
  const [loading, setLoading] = useState<boolean>(true); // Start as true

  const [activeTab, setActiveTab] = useState(0);
  const TAB_STORAGE_KEY = 'calendarActiveTab';

  // Save tab index on change
  const handleTabChange = async (index: number) => {
    setActiveTab(index);
    await AsyncStorage.setItem(TAB_STORAGE_KEY, index.toString());
  };

  // Define available tabs and corresponding components
  const tabs: Tab[] = [
    { key: 'shifts', title: 'Shifts', component: <ShiftCalendar /> },
    { key: 'shift cover', title: 'Shift Cover', component: <EmpSCR /> },
    { key: 'time off', title: 'Time Off', component: <TimeOff /> },
  ];

  // Load Saved Tab If it Exists, otherwise load tab index 0
  useEffect(() => {
    const loadSavedTab = async () => {
      try {
        setLoading(true);
        const savedTabIndex = await AsyncStorage.getItem(TAB_STORAGE_KEY);
        const tabIndex = Number(savedTabIndex);
        if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < tabs.length) {
          setActiveTab(tabIndex);
        } else {
          setActiveTab(0);
        }
      } catch (error) {
        console.warn('Failed to load saved tab index:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSavedTab();
  }, []);

  return (

    <DefaultView backgroundColor={Colors.white}>

      <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>

        {/* Calendar Header */}
        <View style={GlobalStyles.pageHeaderContainer}>

          <Text style={GlobalStyles.pageHeader}>Calendar</Text>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === index && styles.activeTabButton, // Style the active tab
                ]}
                onPress={() => handleTabChange(index)} // Set active tab on click
              >
                <Text style={styles.tabText}>{tab.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>

        {/* Tab Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <LoadingCircle size="large" />
          </View>
        ) : (
          <View style={styles.tabContent}>
            {tabs[activeTab]?.component}
          </View>
        )}

      </View>

    </DefaultView>

  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.altBorderColor,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  tabText: {
    fontSize: 16,
    color: 'black',
  },
  tabContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarPage;