import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import DefaultView from '@/components/DefaultView';
import AdminDrawer from '@/components/admin/AdminDrawer';

import Dashboard from "@/components/admin/Dashboard/Dashboard";
import ShiftCover from '@/components/admin/ShiftCover/ShiftCover';
import TimeOff from '@/components/admin/TimeOff/TimeOff';
import Schedule from "@/components/admin/Schedule/Schedule";
import Staff from "@/components/admin/Staff/Staff";

import { Tab } from '@/components/admin/AdminDrawer';

import { useSession } from '@/utils/SessionContext';


const Admin = () => {
  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const { user } = useSession();

  const [activeTab, setActiveTab] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const TAB_STORAGE_KEY = 'adminActiveTab';

  // Save tab index on change
  const handleTabChange = async (index: number) => {
    setActiveTab(index);
    await AsyncStorage.setItem(TAB_STORAGE_KEY, index.toString());
    setDrawerVisible(false); // auto-close drawer after selecting a tab
  };

  // Define available tabs and corresponding components
  const tabs: Tab[] = [
    { key: 'Dashboard', title: 'Dashboard', component: <Dashboard /> },
    { key: 'Shift Cover', title: 'Shift Cover', component: <ShiftCover /> },
    { key: 'Time Off', title: 'Time Off', component: <TimeOff /> },
    { key: 'Schedule', title: 'Schedule', component: <Schedule /> },
    { key: 'Staff', title: 'Staff', component: <Staff /> },
  ];

  // Load Saved Tab If it Exists
  useEffect(() => {
    const loadSavedTab = async () => {
      try {
        const savedTabIndex = await AsyncStorage.getItem(TAB_STORAGE_KEY);
        const tabIndex = Number(savedTabIndex);
        if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < tabs.length) {
          setActiveTab(tabIndex);
        }
      } catch (error) {
        console.warn('Failed to load saved tab index:', error);
      }
    };
    loadSavedTab();
  }, []);

  return (

    <DefaultView backgroundColor={Colors.white}>

      <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>

        {/* Admin Header */}
        <View style={[GlobalStyles.pageHeaderContainer, styles.adminHeader]}>

          <Text style={GlobalStyles.pageHeader}>Admin</Text>

          <TouchableOpacity
            style={styles.drawerIcon}
            onPress={() => setDrawerVisible(prev => !prev)}
          >
            <Ionicons name="reorder-three-outline" size={35} color={Colors.black} />
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {tabs[activeTab]?.component}
        </View>
      </View>

      <AdminDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

    </DefaultView>

  );
};

const styles = StyleSheet.create({
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  drawerIcon: {
    padding: 5,
  },
  tabContent: {
    flex: 1,
  },
});

export default Admin;
