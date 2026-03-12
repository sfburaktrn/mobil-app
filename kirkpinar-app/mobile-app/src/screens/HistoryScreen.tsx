import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '../components/GlassCard';
import { theme } from '../theme';
import {
    HISTORY_SECTIONS,
    KIRKPINAR_TIMELINE,
    MOCK_KIRKPINAR_INFO,
} from '../utils/mockData';

const accentMap = {
    gold: theme.colors.primary,
    olive: theme.colors.olive,
    bronze: theme.colors.bronze,
};

export const HistoryScreen = () => {
    return (
        <LinearGradient
            colors={['#07110C', '#0D1712', '#020504']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.eyebrow}>TARİHÇE VE GELENEK</Text>
                    <Text style={styles.title}>Kırkpınar sadece turnuva değil, yaşayan bir kültür.</Text>
                    <Text style={styles.subtitle}>{MOCK_KIRKPINAR_INFO}</Text>

                    {HISTORY_SECTIONS.map((section) => (
                        <GlassCard key={section.id} style={styles.storyCard} intensity={18}>
                            <View style={[styles.storyAccent, { backgroundColor: accentMap[section.accent] }]} />
                            <Text style={styles.storyTitle}>{section.title}</Text>
                            <Text style={styles.storyBody}>{section.body}</Text>
                        </GlassCard>
                    ))}

                    <View style={styles.timelineHeader}>
                        <Text style={styles.timelineTitle}>Zaman Tüneli</Text>
                        <Text style={styles.timelineSubtitle}>
                            Asırlık geleneğin bugüne uzanan dönüşümü
                        </Text>
                    </View>

                    {KIRKPINAR_TIMELINE.map((item) => (
                        <View key={item.year} style={styles.timelineRow}>
                            <View style={styles.timelineRail}>
                                <View style={styles.timelineDot} />
                                <View style={styles.timelineLine} />
                            </View>
                            <GlassCard style={styles.timelineCard} intensity={14}>
                                <Text style={styles.timelineYear}>{item.year}</Text>
                                <Text style={styles.timelineCardTitle}>{item.title}</Text>
                                <Text style={styles.timelineDetail}>{item.detail}</Text>
                            </GlassCard>
                        </View>
                    ))}

                    <GlassCard style={styles.guideCard} intensity={18}>
                        <Text style={styles.guideTitle}>Mini Rehber</Text>
                        <View style={styles.guideRow}>
                            <Text style={styles.guideKey}>Cazgır</Text>
                            <Text style={styles.guideValue}>Pehlivanları manilerle er meydanına davet eden geleneksel anlatıcı.</Text>
                        </View>
                        <View style={styles.guideRow}>
                            <Text style={styles.guideKey}>Peşrev</Text>
                            <Text style={styles.guideValue}>Müsabaka öncesi yapılan ritüel hareketler bütünü.</Text>
                        </View>
                        <View style={styles.guideRow}>
                            <Text style={styles.guideKey}>Kispet</Text>
                            <Text style={styles.guideValue}>Pehlivanların güreşte giydiği geleneksel deri kıyafet.</Text>
                        </View>
                    </GlassCard>
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
    subtitle: {
        color: theme.colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    storyCard: {
        marginBottom: theme.spacing.md,
    },
    storyAccent: {
        width: 44,
        height: 4,
        borderRadius: theme.borderRadius.full,
        marginBottom: theme.spacing.md,
    },
    storyTitle: {
        color: theme.colors.text,
        fontSize: 19,
        fontWeight: '800',
        marginBottom: theme.spacing.sm,
    },
    storyBody: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        lineHeight: 22,
    },
    timelineHeader: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    timelineTitle: {
        color: theme.colors.text,
        fontSize: 22,
        fontWeight: '800',
    },
    timelineSubtitle: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        marginTop: theme.spacing.xs,
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    timelineRail: {
        width: 24,
        alignItems: 'center',
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.primary,
        marginTop: theme.spacing.lg,
    },
    timelineLine: {
        flex: 1,
        width: 2,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    timelineCard: {
        flex: 1,
        marginBottom: theme.spacing.md,
    },
    timelineYear: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: theme.spacing.xs,
    },
    timelineCardTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '800',
        marginBottom: theme.spacing.sm,
    },
    timelineDetail: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },
    guideCard: {
        marginTop: theme.spacing.md,
    },
    guideTitle: {
        color: theme.colors.primaryLight,
        fontSize: 20,
        fontWeight: '800',
        marginBottom: theme.spacing.md,
    },
    guideRow: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
        paddingVertical: theme.spacing.md,
    },
    guideKey: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '800',
        marginBottom: theme.spacing.xs,
    },
    guideValue: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },
});
