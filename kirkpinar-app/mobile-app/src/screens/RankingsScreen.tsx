import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '../components/GlassCard';
import { theme } from '../theme';
import { LEADERBOARD } from '../utils/mockData';

export const RankingsScreen = () => {
    const { width } = useWindowDimensions();
    const isCompact = width < 390;
    const me = useMemo(() => LEADERBOARD.find((entry) => entry.isCurrentUser), []);

    return (
        <LinearGradient
            colors={['#07110C', '#0D1712', '#020504']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.eyebrow}>SIRALAMA</Text>
                    <Text style={[styles.title, isCompact && styles.titleCompact]}>Doğruluk ve hız aynı tabloda yarışıyor.</Text>
                    <Text style={styles.subtitle}>
                        En isabetli ve en hızlı tahmin yapan kullanıcılar ödül havuzuna yaklaşır.
                    </Text>

                    {me ? (
                        <GlassCard style={styles.meCard} intensity={20}>
                            <Text style={styles.meLabel}>Benim Durumum</Text>
                            <Text style={styles.meTitle}>#{LEADERBOARD.findIndex((entry) => entry.id === me.id) + 1} sıradasın</Text>
                            <View style={[styles.meStatsRow, isCompact && styles.meStatsRowCompact]}>
                                <View style={styles.meStatBox}>
                                    <Text style={styles.meStatValue}>{me.points}</Text>
                                    <Text style={styles.meStatLabel}>Puan</Text>
                                </View>
                                <View style={styles.meStatBox}>
                                    <Text style={styles.meStatValue}>%{me.accuracy}</Text>
                                    <Text style={styles.meStatLabel}>İsabet</Text>
                                </View>
                                <View style={styles.meStatBox}>
                                    <Text style={styles.meStatValue}>{me.streak}</Text>
                                    <Text style={styles.meStatLabel}>Seri</Text>
                                </View>
                            </View>
                        </GlassCard>
                    ) : null}

                    {LEADERBOARD.map((entry, index) => (
                        <GlassCard
                            key={entry.id}
                            style={[
                                styles.rowCard,
                                entry.isCurrentUser && styles.rowCardActive,
                            ]}
                            intensity={16}
                        >
                            <View style={styles.row}>
                                <Text style={styles.position}>#{index + 1}</Text>
                                <View style={styles.info}>
                                    <Text style={styles.name}>{entry.name}</Text>
                                    <Text style={styles.meta}>
                                        {entry.city} / {entry.badge}
                                    </Text>
                                </View>
                                <View style={styles.rightCol}>
                                    <Text style={styles.points}>{entry.points}</Text>
                                    <Text style={styles.meta}>%{entry.accuracy} isabet</Text>
                                </View>
                            </View>
                        </GlassCard>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxxl,
    },
    eyebrow: {
        color: theme.colors.olive,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: theme.spacing.sm,
    },
    title: {
        color: theme.colors.text,
        fontSize: 28,
        fontWeight: '900',
        lineHeight: 34,
    },
    titleCompact: {
        fontSize: 25,
        lineHeight: 31,
    },
    subtitle: {
        color: theme.colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    meCard: {
        marginBottom: theme.spacing.lg,
    },
    meLabel: {
        color: theme.colors.olive,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: theme.spacing.xs,
    },
    meTitle: {
        color: theme.colors.text,
        fontSize: 22,
        fontWeight: '900',
        marginBottom: theme.spacing.md,
    },
    meStatsRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    meStatsRowCompact: {
        flexDirection: 'column',
    },
    meStatBox: {
        flex: 1,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.cardMuted,
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    meStatValue: {
        color: theme.colors.primaryLight,
        fontSize: 18,
        fontWeight: '900',
        marginBottom: theme.spacing.xs,
    },
    meStatLabel: {
        color: theme.colors.textSecondary,
        fontSize: 11,
        fontWeight: '700',
    },
    rowCard: {
        marginBottom: theme.spacing.sm,
    },
    rowCardActive: {
        borderColor: theme.colors.primary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    position: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: '900',
        width: 42,
    },
    info: {
        flex: 1,
    },
    name: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: '800',
    },
    meta: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: theme.spacing.xs,
    },
    rightCol: {
        alignItems: 'flex-end',
    },
    points: {
        color: theme.colors.primaryLight,
        fontSize: 18,
        fontWeight: '900',
    },
});
