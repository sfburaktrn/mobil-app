import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20 }) => {
    return (
        <View style={[styles.container, style]}>
            <BlurView intensity={intensity} tint="dark" style={styles.blurView}>
                {children}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: theme.colors.card,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    blurView: {
        padding: theme.spacing.xl,
    },
});
