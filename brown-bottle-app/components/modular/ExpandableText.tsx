import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { useWindowDimensions } from 'react-native';

import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';


type Props = {
    text: string | null | undefined;
    numberOfLines?: number;
    readMoreLabel?: string;
    showLessLabel?: string;
    textStyle?: TextStyle;
    actionTextStyle?: TextStyle;
};

const ExpandableText: React.FC<Props> = ({
    text,
    numberOfLines = 1,
    readMoreLabel = 'Read more',
    showLessLabel = 'Show less',
    textStyle = styles.descriptionText,
    actionTextStyle = styles.actionText
}) => {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const safeText = String(text || '');

    const lineHeight = (textStyle as TextStyle).lineHeight ?? 20;
    const BUFFER = 2;
    const maxHeight = numberOfLines * lineHeight + BUFFER;

    return (
        <View>
            {/* Hidden measurement */}
            <View style={{ position: 'absolute', opacity: 0, width: '100%' }}>
                <Text
                    style={[textStyle, { includeFontPadding: false }]}
                    onLayout={(e) => {
                        const height = e.nativeEvent.layout.height;
                        setIsOverflowing(height > maxHeight);
                    }}
                >
                    {safeText}
                </Text>
            </View>

            {/* Visible clipped text */}
            <View
                style={{
                    maxHeight: expanded ? undefined : maxHeight,
                    overflow: 'hidden',
                }}
            >
                {safeText ? (
                    <Text style={textStyle}>{safeText}</Text>
                ) : (
                    <Text style={{ fontStyle: 'italic', color: Colors.gray }}>No description</Text>
                )}
            </View>

            {isOverflowing && (
                <View style={styles.actionContainer}>
                    <TouchableOpacity onPress={() => setExpanded(prev => !prev)}>
                        <Text style={actionTextStyle}>
                            {expanded ? showLessLabel : readMoreLabel}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    actionContainer: {
        width: '100%',
        alignItems: 'flex-start',   // pushes button to the right
        marginBottom: 2,
    },
    descriptionText: {
        ...GlobalStyles.text,
        width: '100%',
        flexWrap: 'wrap',
        overflow: 'hidden',
    },

    actionText: {
        ...GlobalStyles.semiBoldSmallText,
        color: Colors.buttonBlue
    },
});

export default ExpandableText;
