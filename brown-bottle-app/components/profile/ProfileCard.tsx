import React from "react";
import { View, Text, StyleSheet } from "react-native";
import HandleLogout from "../auth/HandleLogout";
import ProfileAvatar from "../ProfileAvatar";
import { Colors } from "@/constants/Colors";
import { Employee } from "@/types/iEmployee";
import AnimatedTouchableWrapper from "../modular/AnimatedTouchable";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    profile: Employee | null;
}

const ProfileCard: React.FC<Props> = ({ profile }) => {
    if (!profile) return null;

    const roles = [
        profile.primary_role_name,
        profile.secondary_role_name,
        profile.tertiary_role_name
    ].filter(Boolean);

    return (
        <View style={styles.wrapper}>
            <View style={styles.profileContainer}>

                {/* Logout */}
                <View style={{ position: "absolute", right: 15, top: 15 }}>
                    <HandleLogout />
                </View>

                {/* Avatar / Name / Email */}
                <View style={styles.row}>
                    <ProfileAvatar size={105} fullName={profile.full_name} />

                    <View style={styles.infoWrapper}>
                        <Text style={styles.nameText}>{profile.full_name}</Text>
                        <Text style={styles.emailText}>{profile.email}</Text>

                        {/* Tags */}
                        <View style={styles.tagRow}>

                            {profile.admin === 1 && (
                                <AnimatedTouchableWrapper>
                                    <View style={GlobalStyles.tag}>
                                        <Text style={styles.tagText}>Admin</Text>
                                    </View>
                                </AnimatedTouchableWrapper>
                            )}

                            {roles.map((role, index) => (
                                <AnimatedTouchableWrapper key={index}>
                                    <View style={GlobalStyles.tag}>
                                        <Text style={styles.tagText}>{role}</Text>
                                    </View>
                                </AnimatedTouchableWrapper>
                            ))}

                        </View>
                    </View>
                </View>

            </View>
        </View>
    );
};

export default ProfileCard;

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        marginBottom: 15
    },
    profileContainer: {
        width: "100%",
        minHeight: 260,
        paddingVertical: 25,
        paddingHorizontal: 20,
        backgroundColor: Colors.mediumTan,
        borderWidth: 1,
        borderColor: Colors.altBorderColor,
        justifyContent: "center",
        borderRadius: 14,
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    infoWrapper: {
        marginLeft: 15,
        flexShrink: 1
    },
    nameText: {
        color: "black",
        fontSize: 22,
        fontWeight: "800"
    },
    emailText: {
        color: "black",
        opacity: 0.9,
        marginTop: 2,
        fontSize: 15
    },
    tagRow: {
        flexDirection: "row",
        marginTop: 8,
        flexWrap: "wrap",
        gap: 6
    },
    tagText: {
        color: "black",
        fontSize: 13,
        fontWeight: "600"
    },
});

