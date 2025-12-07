import { View, Text, StatusBar, StyleSheet } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { Colors } from "@/constants/Colors";
import DefaultView from "@/components/DefaultView";
import DefaultScrollView from "@/components/DefaultScrollView";
import Card from "@/components/modular/Card";
import ProfileCard from "@/components/profile/ProfileCard";
import { useSession } from "@/utils/SessionContext";
import { GlobalStyles } from "@/constants/GlobalStyles";

import { getEmployee } from "@/routes/employee";
import { Employee } from "@/types/iEmployee";
import AccountInfo from "@/components/profile/AccountInfo";
import ProfileStats from "@/components/profile/ProfileStats";

export default function Profile() {
  // Get signed-in user
  const { user } = useSession();
  const [profile, setProfile] = useState<Employee | null>(null);

  useEffect(() => {
    if (user?.employee_id) {
      getEmployee({ employee_id: user.employee_id })
        .then((res) => setProfile(res[0] || null))
        .catch((error) => console.error("Profile fetch error:", error));
    }
  }, [user]);

  // Dynamic Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.white);
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  return (
    <DefaultView backgroundColor={Colors.white}>
      <View style={{ flex: 1, backgroundColor: Colors.bgGray }}>

        {/* Profile Header */}
        <View style={GlobalStyles.pageHeaderContainer}>
          <Text style={GlobalStyles.pageHeader}>Profile</Text>
        </View>

        <DefaultScrollView>

          <View style={{ width: '90%' }}>

            {/* Profile Card */}
            <View style={{ marginTop: 20 }}>
              <ProfileCard profile={profile} />
            </View>

            <View style={[styles.contentRow, { width: '100%' }]}>

              {/* Account Info */}
              <Card style={styles.accountInfo}>
                <AccountInfo profile={profile} />
              </Card>

              {/* Profile Stats */}
              <View style={styles.stats}>
                <ProfileStats profile={profile} />
              </View>

            </View>
          </View>

        </DefaultScrollView>
      </View>
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    textAlign: "left",
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    marginBottom: 8,
  },
  contentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10
  },
  accountInfo: {
    flexBasis: '55%',
    minWidth: 250,
    flexGrow: 1,
    marginVertical: 20,
    borderRadius: 14
  },
  stats: {
    flexBasis: '30%',
    minWidth: 250,
    flexGrow: 1,
    marginVertical: 20,
  }
});

