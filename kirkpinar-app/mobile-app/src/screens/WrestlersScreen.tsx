import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '../components/GlassCard';
import { WrestlerAvatar } from '../components/WrestlerAvatar';
import { theme } from '../theme';
import { BASPEHLIVANLAR } from '../utils/mockData';

type FilterKey = 'all' | 'champions' | 'form';

const FILTERS: Array<{ key: FilterKey; label: string }> = [
    { key: 'all', label: 'Tümü' },
    { key: 'champions', label: 'Şampiyonlar' },
    { key: 'form', label: 'Formda Olanlar' },
];

export const WrestlersScreen = () => {
    const { width } = useWindowDimensions();
    const isCompact = width < 390;
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

    const filteredWrestlers = useMemo(() => {
        return BASPEHLIVANLAR.filter((wrestler) => {
            const normalizedQuery = query.trim().toLocaleLowerCase('tr');
            const matchesQuery =
                !normalizedQuery ||
                wrestler.name.toLocaleLowerCase('tr').includes(normalizedQuery) ||
                wrestler.city.toLocaleLowerCase('tr').includes(normalizedQuery);

            const wins = wrestler.recentMatches.filter((match) => match.result === 'WIN').length;
            const matchesFilter =
                activeFilter === 'all' ||
                (activeFilter === 'champions' && wrestler.championships !== 'Yok') ||
                (activeFilter === 'form' && wins >= 4);

            return matchesQuery && matchesFilter;
        });
    }, [activeFilter, query]);

    return (
        <LinearGradient
            colors={['#07110C', '#0D1712', '#020504']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.eyebrow}>PEHLİVAN ARŞİVİ</Text>
                    <Text style={[styles.title, isCompact && styles.titleCompact]}>Er meydanının yüzlerini tanı.</Text>
                    <Text style={styles.subtitle}>
                        Şehir, başarı ve form durumuna göre pehlivanları keşfet.
                    </Text>

                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Pehlivan veya şehir ara"
                        placeholderTextColor={theme.colors.textMuted}
                        style={styles.searchInput}
                    />

                    <View style={styles.filterRow}>
                        {FILTERS.map((filter) => (
                            <TouchableOpacity
                                key={filter.key}
                                style={[
                                    styles.filterChip,
                                    activeFilter === filter.key && styles.filterChipActive,
                                ]}
                                onPress={() => setActiveFilter(filter.key)}
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        activeFilter === filter.key && styles.filterChipTextActive,
                                    ]}
                                >
                                    {filter.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.resultText}>{filteredWrestlers.length} pehlivan listeleniyor</Text>

                    {filteredWrestlers.map((wrestler) => {
                        const wins = wrestler.recentMatches.filter((match) => match.result === 'WIN').length;

                        return (
                            <GlassCard key={wrestler.id} style={styles.card} intensity={18}>
                                <View style={[styles.cardHeader, isCompact && styles.cardHeaderCompact]}>
                                    <WrestlerAvatar wrestler={wrestler} size={84} />
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardName}>{wrestler.name}</Text>
                                        <Text style={styles.cardMeta}>
                                            {wrestler.city} / {wrestler.title}
                                        </Text>
                                        <View style={styles.tagRow}>
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>%{wrestler.winRate} isabet</Text>
                                            </View>
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>{wins}/5 form</Text>
                                            </View>
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>
                                                    {wrestler.championships === 'Yok' ? 'Aday' : 'Şampiyon'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <Text style={styles.aboutText}>{wrestler.about}</Text>

                                <View style={styles.statsGrid}>
                                    <View style={styles.statsCell}>
                                        <Text style={styles.statsValue}>{wrestler.height}</Text>
                                        <Text style={styles.statsLabel}>Boy</Text>
                                    </View>
                                    <View style={styles.statsCell}>
                                        <Text style={styles.statsValue}>{wrestler.weight} kg</Text>
                                        <Text style={styles.statsLabel}>Kilo</Text>
                                    </View>
                                    <View style={styles.statsCell}>
                                        <Text style={styles.statsValue}>{wrestler.age}</Text>
                                        <Text style={styles.statsLabel}>Yaş</Text>
                                    </View>
                                </View>

                                <View style={styles.footerRow}>
                                    <Text style={styles.footerTitle}>Kırkpınar Geçmişi</Text>
                                    <Text style={styles.footerValue}>{wrestler.championships}</Text>
                                </View>
                            </GlassCard>
                        );
                    })}
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
        fontSize: 30,
        fontWeight: '900',
        lineHeight: 36,
    },
    titleCompact: {
        fontSize: 26,
        lineHeight: 32,
    },
    subtitle: {
        color: theme.colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    searchInput: {
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.cardMuted,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        color: theme.colors.text,
        fontSize: 15,
        marginBottom: theme.spacing.md,
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    filterChip: {
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    filterChipActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
    },
    filterChipText: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
    },
    filterChipTextActive: {
        color: theme.colors.primaryLight,
    },
    resultText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: theme.spacing.md,
    },
    card: {
        marginBottom: theme.spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    cardHeaderCompact: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
    },
    cardName: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: '800',
        marginBottom: theme.spacing.xs,
    },
    cardMeta: {
        color: theme.colors.primary,
        fontSize: 13,
        fontWeight: '700',
        marginBottom: theme.spacing.sm,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    tag: {
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.cardMuted,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    tagText: {
        color: theme.colors.primaryLight,
        fontSize: 11,
        fontWeight: '700',
    },
    aboutText: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    statsCell: {
        flex: 1,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.cardMuted,
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    statsValue: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '900',
        marginBottom: theme.spacing.xs,
    },
    statsLabel: {
        color: theme.colors.textSecondary,
        fontSize: 11,
        fontWeight: '700',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
        paddingTop: theme.spacing.md,
    },
    footerTitle: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
    },
    footerValue: {
        color: theme.colors.primaryLight,
        fontSize: 13,
        fontWeight: '800',
    },
});
