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
import ProfileCardSkeleton from "@/components/ui/skeleton/profile/ProfileCardSkeleton";
import AccountInfoSkeleton from "@/components/ui/skeleton/profile/AccountInfoSkeleton";
import StatSkeletons from "@/components/ui/skeleton/profile/StatSkeletons";

export default function Profile() {
  // Get signed-in user
  const { user } = useSession();
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (user?.employee_id) {
      setLoading(true);

      getEmployee({ employee_id: user.employee_id })
        .then((res) => {
          setProfile(res[0] || null);
        })
        .catch((error) => console.error("Profile fetch error:", error))
        .finally(() => setLoading(false));
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

      <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>

        {/* Profile Header */}
        <View style={GlobalStyles.pageHeaderContainer}>
          <Text style={GlobalStyles.pageHeader}>Profile</Text>
        </View>

        <DefaultScrollView>

          <View style={{ flex: 1, width: '90%' }}>

            {/* Profile Card */}
            <View style={{ marginTop: 20 }}>
              {loading || !profile ? (
                <ProfileCardSkeleton />
              ) : (
                <ProfileCard profile={profile} />
              )}
            </View>
          
            {/* Content Row */}
            <View style={[styles.contentRow, { width: '100%' }]}>
              {/* Account Info */}
              <Card style={styles.accountInfoContainer}>
                {loading || !profile ? (
                  <AccountInfoSkeleton />
                ) :
                  <AccountInfo profile={profile} />
                }
              </Card>

              {/* Profile Stats */}
              <View style={styles.statContainer}>
                {loading || !profile ? (
                  <StatSkeletons />
                ) :
                  <ProfileStats profile={profile} />
                }
              </View>
            </View>

          </View>

        </DefaultScrollView>

      </View>

    </DefaultView>

  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: "center",
    width: '100%',
    columnGap: 10, // Space between them when in a row
    rowGap: 0,    // No space between them when wrapped/stacked
  },
  accountInfoContainer: {
    flexBasis: '55%',
    minWidth: 250,
    flexGrow: 1,
    borderRadius: 14,
    marginVertical: 20,
  },
  statContainer: {
    flexBasis: '30%',
    minWidth: 250,
    flexGrow: 1,
  }
});

