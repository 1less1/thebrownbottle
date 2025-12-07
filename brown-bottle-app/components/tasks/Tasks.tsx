import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ActiveTasks from "./ActiveTasks";
import LoadingCircle from "../modular/LoadingCircle";
import { Colors } from "@/constants/Colors";
import { User } from "@/utils/SessionContext";
import { Section } from "@/types/iSection";
import CompletedTasks from "./CompletedTasks";

type TasksProps = {
    user: User | null;
    sections: Section[];
};

const Tasks: React.FC<TasksProps> = ({ user, sections }) => {
    const [activeTab, setActiveTab] = useState("active");
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const isLoaded = user && sections;

    return (
        <View style={styles.container}>

            {/* Tab Selector */}
            <View style={{ width: "90%" }}>
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === "active" && styles.activeTab
                        ]}
                        onPress={() => setActiveTab("active")}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === "active" && styles.activeTabText
                        ]}>
                            To Do
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === "completed" && styles.activeTab
                        ]}
                        onPress={() => setActiveTab("completed")}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === "completed" && styles.activeTabText
                        ]}>
                            Completed
                        </Text>
                    </TouchableOpacity>

                </View>

                {/* Content Area */}
                <View>
                    {!isLoaded ? (
                        <LoadingCircle size="large" style={{ marginTop: 40 }} />
                    ) : activeTab === "active" ? (
                        <ActiveTasks user={user} refreshKey={refreshKey} onRefresh={refresh} />
                    ) : (
                        <CompletedTasks user={user} refreshKey={refreshKey} onRefresh={refresh} />
                    )}
                </View>
            </View>
        </View>
    );
};

export default Tasks;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: 'center'
    },

    tabBar: {
        flexDirection: "row",
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: 18,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        width: '100%'
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: Colors.black,
        borderRadius: 8,
    },
    tabText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    activeTabText: {
        color: "white",
        fontWeight: "bold",
    },
});
