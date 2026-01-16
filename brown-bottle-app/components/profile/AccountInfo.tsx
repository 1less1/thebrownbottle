import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Employee } from "@/types/iEmployee";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { parseDateFromDateTime } from "@/utils/dateTimeHelpers";

interface Props {
  profile: Employee | null;
}

const AccountInfo: React.FC<Props> = ({ profile }) => {
  if (!profile) return null;

  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 600;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="person-outline" size={18} color="grey" style={{ marginBottom: 15, marginRight: 2 }} />
        <Text style={styles.mainText}> Account Information</Text>
      </View>

      {/* INFO SECTION */}
      <View style={styles.infoContainer}>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Full Name</Text>
          <Text style={styles.text}>{profile.full_name || "N/A"}</Text>
        </View>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Email</Text>
          <Text style={styles.text}>{profile.email || "N/A"}</Text>
        </View>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Phone</Text>
          <Text style={styles.text}>{profile.phone_number || "N/A"}</Text>
        </View>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Primary Role</Text>
          <Text style={styles.text}>{profile.primary_role_name || "N/A"}</Text>
        </View>

        <View style={[styles.infoBlock, isMobile ? styles.mobileWidth : styles.desktopWidth]}>
          <Text style={styles.titleText}>Member Since</Text>
          <Text style={styles.text}>
            {profile.timestamp ? parseDateFromDateTime(profile.timestamp) : "N/A"}
          </Text>
        </View>

      </View>
    </View>
  );
};

export default AccountInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
  },
  mainText: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  infoBlock: {
    marginBottom: 15,
    paddingBottom: 5,
  },
  mobileWidth: {
    width: "100%",
  },
  desktopWidth: {
    width: "48%",
  },
  titleText: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 5,
    color: Colors.darkGray,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8
  },
});

