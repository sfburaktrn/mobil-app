import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Wrestler } from '../utils/mockData';
import { theme } from '../theme';

interface WrestlerAvatarProps {
    wrestler: Wrestler;
    size?: number;
}

const getInitials = (name: string) =>
    name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

export const WrestlerAvatar = ({ wrestler, size = 72 }: WrestlerAvatarProps) => {
    const borderRadius = size / 2;
    const initials = getInitials(wrestler.name);

    if (wrestler.localImage) {
        return (
            <Image
                source={wrestler.localImage}
                style={[
                    styles.image,
                    {
                        width: size,
                        height: size,
                        borderRadius,
                    },
                ]}
            />
        );
    }

    return (
        <View
            style={[
                styles.fallback,
                {
                    width: size,
                    height: size,
                    borderRadius,
                },
            ]}
        >
            <Text style={[styles.initials, { fontSize: size * 0.3 }]}>{initials}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        borderWidth: 2,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surfaceElevated,
    },
    fallback: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surfaceElevated,
    },
    initials: {
        color: theme.colors.primaryLight,
        fontWeight: '900',
        letterSpacing: 1,
    },
});
