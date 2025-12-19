import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import ActiveTasks from "./ActiveTasks";
import CompletedTasks from "./CompletedTasks";
import LoadingCircle from "../modular/LoadingCircle";

import { Colors } from "@/constants/Colors";
import { useSession } from "@/utils/SessionContext";
import { User } from "@/utils/SessionContext";
import { Employee } from "@/types/iEmployee";

export default function EmpTasks() {
    const { user } = useSession();
    const [activeTab, setActiveTab] = useState(0);

    const [refreshing, setRefreshing] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRefresh = () => {
        setRefreshing(true);
        setRefreshTrigger(prev => prev + 1);

        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    // Define available tabs and corresponding components
    const tabs = [
        {
            key: "active",
            title: "To Do",
            component: <ActiveTasks user={user as Employee} onRefreshDone={() => setRefreshing(false)} parentRefresh={refreshTrigger} />
        },
        {
            key: "completed",
            title: "Completed",
            component: <CompletedTasks user={user as Employee} onRefreshDone={() => setRefreshing(false)} parentRefresh={refreshTrigger} />
        }
    ];

    const isLoaded = user;

    return (
        <View style={styles.container}>
            {/* Tab Selector */}
            <View style={{ width: "83%" }}>
                <View style={styles.tabBar}>
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.tabButton,
                                activeTab === index && styles.activeTab
                            ]}
                            onPress={() => setActiveTab(index)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === index && styles.activeTabText
                                ]}
                            >
                                {tab.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Content Area */}
                <View>
                    {!isLoaded ? (
                        <LoadingCircle size="large" style={{ marginTop: 40 }} />
                    ) : (
                        tabs[activeTab]?.component
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    tabBar: {
        flexDirection: "row",
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: 18,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        width: "100%"
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center"
    },
    activeTab: {
        backgroundColor: Colors.black,
        borderRadius: 8
    },
    tabText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black"
    },
    activeTabText: {
        color: "white",
        fontWeight: "bold"
    }
});
