import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCallback, useEffect, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import DefaultView from '@/components/DefaultView';
import { ScrollView } from 'react-native';
import LoadingCircle from '@/components/modular/LoadingCircle';
import Tasks from '@/components/tasks/Tasks';


// Get Session Data
import { useSession } from '@/utils/SessionContext';
import { Section } from '@/types/iSection';
import { getSection } from '@/routes/section';

export default function TaskPage() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const { user } = useSession();

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    async function loadSections() {
      const data = await getSection();
      setSections(data);
    }
    loadSections();
  }, []);

  return (
    <DefaultView backgroundColor={Colors.white}>
      <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>
        <View style={{ width: '100%', paddingTop: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.altBorderColor }}>
          <Text style={GlobalStyles.pageHeader}>Tasks</Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <Tasks user={user} sections={sections} />
        </ScrollView>
      </View>
    </DefaultView>
  );
}


const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
    marginLeft: 20,
    marginTop: 40,
    marginBottom: 20,

  },
  tabBar: {
    alignSelf: 'center',
    flexDirection: "row",
    borderRadius: 10,
    width: "90%",
    marginTop: 20,
    marginBottom: 15,
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  activeTabButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: Colors.darkTan,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 16,
    color: "black",
  },
  tabContent: {
    flex: 1,
    width: '85%',
    alignItems: 'center',
    alignSelf: 'center',
  },
});