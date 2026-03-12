import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    loading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    disabled = false,
    loading = false,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return '#333';
        switch (variant) {
            case 'primary': return theme.colors.primary;
            case 'secondary': return theme.colors.surfaceElevated;
            case 'outline': return 'transparent';
            default: return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return '#888';
        if (variant === 'primary') return '#111'; // Dark text on gold
        return theme.colors.primary;
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outline,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
        minWidth: 0,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    outline: {
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    text: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.2,
        textAlign: 'center',
        lineHeight: 18,
        flexShrink: 1,
    },
});
