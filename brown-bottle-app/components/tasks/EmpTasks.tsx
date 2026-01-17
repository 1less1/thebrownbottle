import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";

import LoadingCircle from "@/components/modular/LoadingCircle";

import EmpActiveTasks from "@/components/tasks/EmpActiveTasks";
import EmpCompTasks from "@/components/tasks/EmpCompTasks";

import { Employee } from "@/types/iEmployee";

import { useSession } from "@/utils/SessionContext";
import DefaultScrollView from "../DefaultScrollView";

interface Tab {
    key: string;
    title: string;
    component: React.ReactNode;
}

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

    // Define tabs and corresponding components
    const tabs: Tab[] = [
        {
            key: "active",
            title: "To Do",
            component: <EmpActiveTasks user={user as Employee} onRefreshDone={() => setRefreshing(false)} parentRefresh={refreshTrigger} />
        },
        {
            key: "completed",
            title: "Completed",
            component: <EmpCompTasks user={user as Employee} onRefreshDone={() => setRefreshing(false)} parentRefresh={refreshTrigger} />
        }
    ];

    const isLoaded = user;

    return (

        <DefaultScrollView refreshing={refreshing} onRefresh={handleRefresh} scrollEnabled={false}>

            <View style={{ width: "85%" }}>

                {/* Tab Bar */}
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

                {/* Render Content */}
                <View>
                    {tabs[activeTab]?.component}
                </View>

            </View>

        </DefaultScrollView>

    );
};

const styles = StyleSheet.create({
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
