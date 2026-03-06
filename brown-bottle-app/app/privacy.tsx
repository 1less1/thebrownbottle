// Privacy policy screen
// https://brownbottleapp.com/privacy

import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";

export default function Privacy() {

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.title}>Privacy Policy</Text>
                <Text style={styles.date}>Effective Date: March 2026</Text>

                <Text style={styles.paragraph}>
                    CF Brown Bottle ("the App") is an employee scheduling and workplace
                    management application used by staff members of The Brown Bottle
                    restaurant. This Privacy Policy explains what information we collect,
                    how it is used, and how it is protected.
                </Text>

                <Text style={styles.heading}>Information We Collect</Text>

                <Text style={styles.paragraph}>
                    The App collects only the information necessary to provide scheduling
                    and communication features for employees.
                </Text>

                <Text style={styles.listItem}>
                    • Employee information such as name, email address, and role
                </Text>

                <Text style={styles.listItem}>
                    • Work schedule data including assigned shifts and sections
                </Text>

                <Text style={styles.listItem}>
                    • Shift related requests such as shift coverage or time-off requests
                </Text>

                <Text style={styles.listItem}>
                    • Device push notification tokens used to deliver work notifications
                </Text>

                <Text style={styles.listItem}>
                    • Basic diagnostic or application logs used to maintain service quality
                </Text>

                <Text style={styles.heading}>Authentication</Text>

                <Text style={styles.paragraph}>
                    The App uses a third-party authentication providers to verify user
                    identity. When signing in, authentication providers share basic
                    profile information such as name and email address for account
                    verification purposes.
                </Text>

                <Text style={styles.heading}>How We Use Information</Text>

                <Text style={styles.paragraph}>
                    Information collected through the App is used strictly for internal
                    restaurant operations, including:
                </Text>

                <Text style={styles.listItem}>
                    • Displaying employee schedules
                </Text>

                <Text style={styles.listItem}>
                    • Managing shift swaps and time-off requests
                </Text>

                <Text style={styles.listItem}>
                    • Sending workplace notifications
                </Text>

                <Text style={styles.listItem}>
                    • Authenticating employee accounts
                </Text>

                <Text style={styles.listItem}>
                    • Maintaining application security and reliability
                </Text>

                <Text style={styles.heading}>Data Sharing</Text>

                <Text style={styles.paragraph}>
                    We do not sell, rent, or trade personal information. Data may only be
                    accessible to authorized restaurant management or service providers
                    required to operate the application, such as hosting or authentication
                    infrastructure.
                </Text>

                <Text style={styles.heading}>Data Security</Text>

                <Text style={styles.paragraph}>
                    We take reasonable measures to protect stored information including
                    secure server infrastructure, encrypted network connections, and
                    access controls restricting who can view employee data.
                </Text>

                <Text style={styles.heading}>Data Retention</Text>

                <Text style={styles.paragraph}>
                    Employee data is retained only as long as necessary to support
                    workplace scheduling and operational requirements. When employees
                    leave the organization, access to the App may be removed and
                    associated information may be archived or deleted.
                </Text>

                <Text style={styles.heading}>User Rights</Text>

                <Text style={styles.paragraph}>
                    Employees may request corrections to their personal information or
                    request removal of their account data by contacting restaurant
                    management.
                </Text>

                <Text style={styles.heading}>Changes to This Policy</Text>

                <Text style={styles.paragraph}>
                    This Privacy Policy may be updated from time to time to reflect
                    changes to the application or legal requirements. Updates will be
                    reflected by the revised effective date.
                </Text>

                <Text style={styles.heading}>Contact</Text>

                <Text style={styles.paragraph}>
                    If you have questions regarding this Privacy Policy, please contact
                    The Brown Bottle restaurant management.
                </Text>

                <View style={{ height: 40 }} />

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({

    // Main page container for centered readable layout
    container: {
        maxWidth: 900,
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
    },

    // Page title styling
    title: {
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 8,
    },

    // Effective date styling
    date: {
        fontSize: 14,
        marginBottom: 24,
        opacity: 0.7,
    },

    // Section heading styling
    heading: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 22,
        marginBottom: 10,
    },

    // Standard paragraph styling
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 10,
    },

    // Bullet list styling
    listItem: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 6,
        paddingLeft: 6,
    }

});