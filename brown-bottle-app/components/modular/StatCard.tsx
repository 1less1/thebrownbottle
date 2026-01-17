import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedTouchableWrapper from '@/components/modular/AnimatedTouchable';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';

import LoadingCircle from '@/components/modular/LoadingCircle';

export type StatCardProps = {
    title?: string;
    value?: string | number;
    footerText?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    style?: ViewStyle;
    titleStyle?: TextStyle;
    valueStyle?: TextStyle;
    footerTextStyle?: TextStyle;
    iconContainerStyle?: ViewStyle;
    backgroundColor?: string;
    loading?: boolean;
    borderColor?: string;
    onPress?: () => void;
};

const StatCard: React.FC<StatCardProps> = ({
    loading = false,
    title,
    value,
    footerText,
    iconName,
    iconColor = Colors.blue,
    style,
    titleStyle,
    valueStyle,
    footerTextStyle,
    iconContainerStyle,
    backgroundColor = '#f2f8ff',
    borderColor,
    onPress,
}) => {

    if (loading) return <LoadingCircle size="small" />;

    return (
        <AnimatedTouchableWrapper
            onPress={onPress}
            pressScale={0.95}
            hoverScale={1.01}
            style={{ flex: 1 }}
        >
            <View style={[styles.card, { backgroundColor, borderColor }, style]}>
                <View>
                    <Text style={[styles.title, titleStyle]}>{title}</Text>
                    <Text style={[styles.value, valueStyle]}>{value}</Text>

                    {footerText && (
                        <Text style={[styles.footer, footerTextStyle]}>
                            {footerText}
                        </Text>
                    )}
                </View>

                {iconName && (
                    <View style={[styles.iconContainer, iconContainerStyle]}>
                        <Ionicons name={iconName} size={26} color={iconColor} />
                    </View>
                )}
            </View>
        </AnimatedTouchableWrapper>
    );
};

export default StatCard;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 110,
        padding: 18,
        marginBottom: 8,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
    },
    value: {
        fontSize: 32,
        fontWeight: '700',
        marginTop: 4,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e5f1ff',
    },
    footer: {
        fontSize: 14,
        marginTop: 2,
        opacity: 0.75,
    }
});
