import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '../components/GlassCard';
import { CustomButton } from '../components/CustomButton';
import { WrestlerAvatar } from '../components/WrestlerAvatar';
import { theme } from '../theme';
import {
    FEATURED_MATCHES,
    HOME_HIGHLIGHTS,
    KIRKPINAR_EVENT,
    LEADERBOARD,
    SPOTLIGHT_WRESTLERS,
} from '../utils/mockData';

const getTimeLeft = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - Date.now();

    if (diff <= 0) {
        return { days: '00', hours: '00', minutes: '00', seconds: '00' };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
    };
};

export const HomeScreen = () => {
    const { width } = useWindowDimensions();
    const isCompact = width < 430;
    const navigation = useNavigation<any>();
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(KIRKPINAR_EVENT.startDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(KIRKPINAR_EVENT.startDate));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const topThree = useMemo(() => LEADERBOARD.slice(0, 3), []);

    return (
        <LinearGradient
            colors={['#07110C', '#0D1712', '#020504']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.brandEyebrow}>ER MEYDANI DENEYİMİ</Text>
                        <Text style={styles.brandTitle}>KIRKPINAR</Text>
                        <Text style={[styles.brandSubtitle, isCompact && styles.brandSubtitleCompact]}>{KIRKPINAR_EVENT.subtitle}</Text>
                    </View>

                    <GlassCard style={styles.heroCard} intensity={24}>
                        <Text style={styles.heroTitle}>{KIRKPINAR_EVENT.title}</Text>
                        <Text style={styles.heroMeta}>
                            {KIRKPINAR_EVENT.venue} / {KIRKPINAR_EVENT.city}
                        </Text>

                        <View style={styles.countdownRow}>
                            {[
                                { label: 'GÜN', value: timeLeft.days },
                                { label: 'SAAT', value: timeLeft.hours },
                                { label: 'DAK', value: timeLeft.minutes },
                                { label: 'SN', value: timeLeft.seconds },
                            ].map((item) => (
                                <View key={item.label} style={styles.countdownItem}>
                                    <Text style={styles.countdownValue}>{item.value}</Text>
                                    <Text style={styles.countdownLabel}>{item.label}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.deadlineText}>{KIRKPINAR_EVENT.predictionDeadlineText}</Text>

                        <View style={[styles.heroButtonRow, isCompact && styles.heroButtonRowCompact]}>
                            <CustomButton
                                title="Tahminlere Git"
                                onPress={() => navigation.navigate('Tahminler')}
                                style={styles.heroButton}
                            />
                            <CustomButton
                                title="Pehlivanları Keşfet"
                                variant="outline"
                                onPress={() => navigation.navigate('Pehlivanlar')}
                                style={styles.heroButton}
                            />
                        </View>
                    </GlassCard>

                    <View style={[styles.highlightRow, isCompact && styles.highlightRowCompact]}>
                        {HOME_HIGHLIGHTS.map((highlight) => (
                            <GlassCard key={highlight.id} style={styles.highlightCard} intensity={16}>
                                <Text style={styles.highlightLabel}>{highlight.label}</Text>
                                <Text style={styles.highlightValue}>{highlight.value}</Text>
                            </GlassCard>
                        ))}
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Öne Çıkan Eşleşmeler</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Tahminler')}>
                            <Text style={styles.sectionLink}>Tümünü gör</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                        {FEATURED_MATCHES.map((match) => (
                            <GlassCard key={match.id} style={[styles.matchCard, { width: Math.min(Math.max(width * 0.74, 250), 320) }]} intensity={18}>
                                <Text style={styles.roundBadge}>{match.round}</Text>
                                <View style={styles.matchHeader}>
                                    <View style={styles.matchWrestler}>
                                        <WrestlerAvatar wrestler={match.wrestler1} size={60} />
                                        <Text style={styles.matchName}>{match.wrestler1.name}</Text>
                                        <Text style={styles.matchCity}>{match.wrestler1.city}</Text>
                                    </View>
                                    <Text style={styles.vsText}>VS</Text>
                                    <View style={styles.matchWrestler}>
                                        <WrestlerAvatar wrestler={match.wrestler2} size={60} />
                                        <Text style={styles.matchName}>{match.wrestler2.name}</Text>
                                        <Text style={styles.matchCity}>{match.wrestler2.city}</Text>
                                    </View>
                                </View>
                            </GlassCard>
                        ))}
                    </ScrollView>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Günün Pehlivanları</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Pehlivanlar')}>
                            <Text style={styles.sectionLink}>Keşfet</Text>
                        </TouchableOpacity>
                    </View>

                    {SPOTLIGHT_WRESTLERS.slice(0, 3).map((wrestler) => (
                        <GlassCard key={wrestler.id} style={styles.spotlightCard} intensity={18}>
                            <View style={styles.spotlightHeader}>
                                <WrestlerAvatar wrestler={wrestler} size={68} />
                                <View style={styles.spotlightInfo}>
                                    <Text style={styles.spotlightName}>{wrestler.name}</Text>
                                    <Text style={styles.spotlightMeta}>
                                        {wrestler.city} / {wrestler.title}
                                    </Text>
                                    <Text style={styles.spotlightDesc} numberOfLines={3}>
                                        {wrestler.about}
                                    </Text>
                                </View>
                            </View>
                        </GlassCard>
                    ))}

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Kırkpınar’dan Bir Bilgi</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Tarihçe')}>
                            <Text style={styles.sectionLink}>Devamı</Text>
                        </TouchableOpacity>
                    </View>

                    <GlassCard style={styles.infoCard} intensity={18}>
                        <Text style={styles.infoTitle}>Altın kemer sadece güç değil istikrar ödülüdür.</Text>
                        <Text style={styles.infoText}>
                            Başpehlivanlık yolculuğunda tek bir güçlü an yetmez; kondisyon, sabır, oyun bilgisi ve psikolojik dayanıklılık birlikte çalışır.
                        </Text>
                    </GlassCard>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Sıralama Özeti</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Sıralama')}>
                            <Text style={styles.sectionLink}>Tam tablo</Text>
                        </TouchableOpacity>
                    </View>

                    {topThree.map((entry, index) => (
                        <GlassCard key={entry.id} style={styles.rankingCard} intensity={16}>
                            <View style={styles.rankingRow}>
                                <Text style={styles.rankingPosition}>#{index + 1}</Text>
                                <View style={styles.rankingInfo}>
                                    <Text style={styles.rankingName}>{entry.name}</Text>
                                    <Text style={styles.rankingMeta}>
                                        {entry.city} / %{entry.accuracy} isabet
                                    </Text>
                                </View>
                                <Text style={styles.rankingPoints}>{entry.points}</Text>
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
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxxl,
    },
    header: {
        marginBottom: theme.spacing.lg,
    },
    brandEyebrow: {
        color: theme.colors.olive,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: theme.spacing.sm,
    },
    brandTitle: {
        color: theme.colors.primaryLight,
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: 4,
    },
    brandSubtitle: {
        marginTop: theme.spacing.sm,
        color: theme.colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
    },
    brandSubtitleCompact: {
        fontSize: 14,
        lineHeight: 20,
    },
    heroCard: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    heroTitle: {
        color: theme.colors.text,
        fontSize: 24,
        fontWeight: '900',
        lineHeight: 30,
    },
    heroMeta: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '700',
        marginTop: theme.spacing.sm,
    },
    countdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    countdownItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.cardMuted,
    },
    countdownValue: {
        color: theme.colors.primaryLight,
        fontSize: 24,
        fontWeight: '900',
    },
    countdownLabel: {
        color: theme.colors.textSecondary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginTop: theme.spacing.xs,
    },
    deadlineText: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        marginBottom: theme.spacing.lg,
    },
    heroButtonRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    heroButtonRowCompact: {
        flexDirection: 'column',
    },
    heroButton: {
        flex: 1,
    },
    highlightRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.xl,
    },
    highlightRowCompact: {
        flexDirection: 'column',
    },
    highlightCard: {
        flex: 1,
    },
    highlightLabel: {
        color: theme.colors.textMuted,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: theme.spacing.xs,
    },
    highlightValue: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: '800',
        lineHeight: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '800',
    },
    sectionLink: {
        color: theme.colors.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    horizontalList: {
        paddingBottom: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    matchCard: {
    },
    roundBadge: {
        color: theme.colors.olive,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: theme.spacing.md,
    },
    matchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
    },
    matchWrestler: {
        flex: 1,
        alignItems: 'center',
    },
    matchName: {
        marginTop: theme.spacing.sm,
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: '800',
        textAlign: 'center',
    },
    matchCity: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: theme.spacing.xs,
    },
    vsText: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: '900',
    },
    spotlightCard: {
        marginBottom: theme.spacing.md,
    },
    spotlightHeader: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    spotlightInfo: {
        flex: 1,
    },
    spotlightName: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: '800',
        marginBottom: theme.spacing.xs,
    },
    spotlightMeta: {
        color: theme.colors.primary,
        fontSize: 13,
        fontWeight: '700',
        marginBottom: theme.spacing.sm,
    },
    spotlightDesc: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },
    infoCard: {
        marginBottom: theme.spacing.xl,
    },
    infoTitle: {
        color: theme.colors.primaryLight,
        fontSize: 18,
        fontWeight: '800',
        marginBottom: theme.spacing.sm,
    },
    infoText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        lineHeight: 22,
    },
    rankingCard: {
        marginBottom: theme.spacing.sm,
    },
    rankingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankingPosition: {
        color: theme.colors.primary,
        fontSize: 20,
        fontWeight: '900',
        width: 40,
    },
    rankingInfo: {
        flex: 1,
    },
    rankingName: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: '800',
    },
    rankingMeta: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: theme.spacing.xs,
    },
    rankingPoints: {
        color: theme.colors.primaryLight,
        fontSize: 18,
        fontWeight: '900',
    },
});
