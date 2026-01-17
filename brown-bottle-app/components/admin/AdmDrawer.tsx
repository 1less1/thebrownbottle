import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

export interface Tab {
    key: string;
    title: string;
    component: React.ReactNode;
}

interface Props {
    visible: boolean;
    onClose: () => void;
    activeTab: number;
    onTabChange: (index: number) => void;
    tabs: Tab[];
}

const AdmDrawer = ({ visible, onClose, activeTab, onTabChange, tabs = [] }: Props) => {
    const { width, height } = useWindowDimensions();
    const SCREEN_WIDTH = width;
    const SCREEN_HEIGHT = height;

    const isMobile = width < 768;
    const DRAWER_WIDTH = isMobile ? width * 0.5 : 350;

    if (!tabs || tabs.length === 0) return null;

    // Drawer slide animation
    const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;

    // Overlay fade animation
    const overlayAnim = useRef(new Animated.Value(0)).current;

    // Animate open/close
    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: visible ? 0 : DRAWER_WIDTH,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
                toValue: visible ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    }, [visible, width]);

    return (
        <>
            {/* Overlay */}
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View
                    pointerEvents={visible ? "auto" : "none"}
                    style={[
                        styles.overlay,
                        { opacity: overlayAnim }
                    ]}
                />
            </TouchableWithoutFeedback>

            {/* Drawer */}
            <Animated.View
                style={[
                    styles.drawerContainer,
                    {
                        width: DRAWER_WIDTH,
                        height: SCREEN_HEIGHT,
                        transform: [{ translateX: slideAnim }]
                    }
                ]}
            >
                <View style={[styles.tabContainer, { marginVertical: isMobile ? 100 : 50 }]}>
                    {tabs.map((tab, index) => (
                        <Pressable
                            key={tab.key}
                            style={[
                                styles.tabItem,
                                activeTab === index && styles.activeTabItem,
                            ]}
                            onPress={() => onTabChange(index)}
                        >
                            <Text
                                style={[
                                    [GlobalStyles.mediumAltText, { color: Colors.gray }],
                                    activeTab === index && GlobalStyles.semiBoldMediumText,
                                ]}
                            >
                                {tab.title}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </Animated.View >
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    drawerContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        backgroundColor: Colors.white,
        borderLeftWidth: 0.8,
        borderLeftColor: Colors.borderColor,
    },
    tabContainer: {
        flex: 1,
    },
    tabItem: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    activeTabItem: {
        backgroundColor: Colors.bgApp,
        borderLeftWidth: 4,
        borderLeftColor: Colors.borderColor,
    },

});

export default AdmDrawer;