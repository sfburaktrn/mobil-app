import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions,
    FlatList, TouchableOpacity, Animated as RNAnimated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';
import { BASPEHLIVANLAR, Wrestler } from '../utils/mockData';

const { height, width } = Dimensions.get('window');
const CARD_WIDTH = width - 24;
const CARD_HEIGHT = height * 0.72;
const ONBOARDING_KEY = 'profile_ob_v2'; // bumped version to reset

// ═══════════════════════════════════════════
// Onboarding Overlay
// ═══════════════════════════════════════════
const GoldenArrow = ({ direction, label, sublabel, delay }: { direction: 'right' | 'left' | 'down'; label: string; sublabel: string; delay: number }) => {
    const anim = useRef(new RNAnimated.Value(0)).current;
    const fadeIn = useRef(new RNAnimated.Value(0)).current;

    useEffect(() => {
        RNAnimated.timing(fadeIn, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start();
        RNAnimated.loop(
            RNAnimated.sequence([
                RNAnimated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }),
                RNAnimated.timing(anim, { toValue: 0, duration: 700, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const translate = direction === 'right'
        ? { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) }
        : direction === 'left'
            ? { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) }
            : { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }) };

    const arrowChar = direction === 'right' ? '⟫' : direction === 'left' ? '⟪' : '⟱';

    return (
        <RNAnimated.View style={[obStyles.item, { opacity: fadeIn }]}>
            <RNAnimated.View style={[obStyles.arrowBox, { transform: [translate] }]}>
                <LinearGradient colors={['#E5C07B', '#D4A017', '#B8860B']} style={obStyles.arrowCircle}>
                    <Text style={obStyles.arrowChar}>{arrowChar}</Text>
                </LinearGradient>
            </RNAnimated.View>
            <View>
                <Text style={obStyles.action}>{label}</Text>
                <Text style={obStyles.desc}>{sublabel}</Text>
            </View>
        </RNAnimated.View>
    );
};

const OnboardingOverlay = ({ onDismiss }: { onDismiss: () => void }) => {
    const fade = useRef(new RNAnimated.Value(0)).current;
    const pulse = useRef(new RNAnimated.Value(0.5)).current;

    useEffect(() => {
        RNAnimated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        RNAnimated.loop(RNAnimated.sequence([
            RNAnimated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
            RNAnimated.timing(pulse, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        ])).start();
    }, []);

    return (
        <RNAnimated.View style={[obStyles.overlay, { opacity: fade }]}>
            <TouchableOpacity style={obStyles.touchable} onPress={onDismiss} activeOpacity={1}>
                <LinearGradient colors={['#E5C07B', '#D4A017']} style={obStyles.titleBadge}>
                    <Text style={obStyles.title}>KULLANIM KILAVUZU</Text>
                </LinearGradient>
                <View style={obStyles.line} />

                <GoldenArrow direction="right" label="SAĞA KAYDIR" sublabel="Sonraki Pehlivan" delay={200} />
                <GoldenArrow direction="left" label="SOLA KAYDIR" sublabel="Önceki Pehlivan" delay={500} />
                <GoldenArrow direction="down" label="AŞAĞI KAYDIR" sublabel="Daha Fazla Bilgi" delay={800} />

                <RNAnimated.Text style={[obStyles.dismiss, { opacity: pulse }]}>
                    Devam etmek için dokun
                </RNAnimated.Text>
            </TouchableOpacity>
        </RNAnimated.View>
    );
};

// ═══════════════════════════════════════════
// Main Screen
// ═══════════════════════════════════════════
export const ProfileScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        AsyncStorage.getItem(ONBOARDING_KEY).then(val => {
            if (!val) setShowOnboarding(true);
        });
    }, []);

    const dismissOnboarding = useCallback(() => {
        setShowOnboarding(false);
        AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    }, []);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const renderItem = useCallback(({ item }: { item: Wrestler }) => (
        <View style={styles.cardWrapper}>
            <View style={styles.card}>
                <ScrollView
                    contentContainerStyle={styles.cardContent}
                    showsVerticalScrollIndicator={true}
                    bounces={true}
                    nestedScrollEnabled={true}
                >
                    {/* Avatar */}
                    <View style={styles.avatarGlow}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.avatarImage}
                            defaultSource={require('../../assets/icon.png')}
                        />
                    </View>

                    <Text style={styles.name}>{item.name.toUpperCase()}</Text>
                    <Text style={styles.titleText}>"{item.title}"</Text>

                    <View style={styles.aboutBox}>
                        <Text style={styles.aboutText}>{item.about}</Text>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{item.height}</Text>
                            <Text style={styles.statLabel}>BOY (m)</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{item.weight}</Text>
                            <Text style={styles.statLabel}>KİLO</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{item.age}</Text>
                            <Text style={styles.statLabel}>YAŞ</Text>
                        </View>
                    </View>

                    {/* Info */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoDot, { backgroundColor: '#4ADE80' }]} />
                            <Text style={styles.infoLabel}>Memleket</Text>
                            <Text style={styles.infoValue}>{item.city}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoDot, { backgroundColor: '#E5C07B' }]} />
                            <Text style={styles.infoLabel}>Kırkpınar Şamp.</Text>
                            <Text style={styles.infoValue}>{item.championships}</Text>
                        </View>
                        {item.totalMatches && item.winRate ? (
                            <View style={styles.infoRow}>
                                <View style={[styles.infoDot, { backgroundColor: '#60A5FA' }]} />
                                <Text style={styles.infoLabel}>Kariyer</Text>
                                <Text style={styles.infoValue}>{item.totalMatches} Maç / %{item.winRate}</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Medals */}
                    {item.medals && (item.medals.gold > 0 || item.medals.silver > 0 || item.medals.bronze > 0) && (
                        <View style={styles.medalsRow}>
                            <View style={styles.medalItem}>
                                <View style={[styles.medalCircle, { borderColor: '#FFD700' }]}><Text style={styles.medalStar}>★</Text></View>
                                <Text style={[styles.medalCount, { color: '#FFD700' }]}>{item.medals.gold}</Text>
                                <Text style={styles.medalLabel}>ALTIN</Text>
                            </View>
                            <View style={styles.medalItem}>
                                <View style={[styles.medalCircle, { borderColor: '#C0C0C0' }]}><Text style={styles.medalStar}>★</Text></View>
                                <Text style={[styles.medalCount, { color: '#C0C0C0' }]}>{item.medals.silver}</Text>
                                <Text style={styles.medalLabel}>GÜMÜŞ</Text>
                            </View>
                            <View style={styles.medalItem}>
                                <View style={[styles.medalCircle, { borderColor: '#CD7F32' }]}><Text style={styles.medalStar}>★</Text></View>
                                <Text style={[styles.medalCount, { color: '#CD7F32' }]}>{item.medals.bronze}</Text>
                                <Text style={styles.medalLabel}>BRONZ</Text>
                            </View>
                        </View>
                    )}

                    {/* Last 5 Matches */}
                    <View style={styles.matchesSection}>
                        <Text style={styles.sectionTitle}>SON 5 KARŞILAŞMASI</Text>
                        {item.recentMatches.map((match) => (
                            <View key={match.id} style={styles.matchRow}>
                                <View style={styles.matchLeft}>
                                    <Text style={styles.matchDate}>{match.date}</Text>
                                    <Text style={styles.matchRound}>{match.round}</Text>
                                </View>
                                <Text style={styles.matchOpponent} numberOfLines={1}>{match.opponentName}</Text>
                                <View style={[styles.resultBadge, match.result === 'WIN' ? styles.winBadge : styles.lossBadge]}>
                                    <Text style={[styles.resultText, match.result === 'WIN' ? styles.winText : styles.lossText]}>
                                        {match.result === 'WIN' ? 'G' : 'M'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    ), []);

    return (
        <LinearGradient colors={['#1a1500', '#0a0a0c', '#000000']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.screenTitle}>PEHLİVAN PROFİLLERİ</Text>
                    <View style={styles.headerDivider} />
                    <Text style={styles.subtitle}>{currentIndex + 1} / {BASPEHLIVANLAR.length}</Text>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={BASPEHLIVANLAR}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    snapToInterval={width}
                    decelerationRate="fast"
                    getItemLayout={(_, index) => ({
                        length: width,
                        offset: width * index,
                        index,
                    })}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                    windowSize={5}
                />

                {/* Dots */}
                <View style={styles.dotBar}>
                    {[...Array(Math.min(7, BASPEHLIVANLAR.length))].map((_, i) => {
                        const dotIndex = Math.max(0, Math.min(currentIndex - 3, BASPEHLIVANLAR.length - 7)) + i;
                        return <View key={dotIndex} style={[styles.dot, dotIndex === currentIndex && styles.dotActive]} />;
                    })}
                </View>
            </SafeAreaView>

            {showOnboarding && <OnboardingOverlay onDismiss={dismissOnboarding} />}
        </LinearGradient>
    );
};

// ═══════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════
const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1, paddingTop: theme.spacing.lg },
    header: { alignItems: 'center', marginBottom: 8 },
    screenTitle: { fontSize: 18, fontWeight: '800', color: '#E5C07B', letterSpacing: 4 },
    headerDivider: { width: 40, height: 2, backgroundColor: '#E5C07B', marginTop: 6, marginBottom: 4, opacity: 0.5 },
    subtitle: { fontSize: 12, color: '#A0AAB2', letterSpacing: 3, fontWeight: '600' },

    // Card wrapper (full width for paging)
    cardWrapper: { width: width, paddingHorizontal: 12, height: CARD_HEIGHT },
    card: {
        flex: 1, borderRadius: 20,
        backgroundColor: 'rgba(20, 22, 28, 0.92)',
        borderWidth: 1.5, borderColor: 'rgba(212, 175, 55, 0.3)',
        overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 12,
    },
    cardContent: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16, paddingBottom: 30 },

    avatarGlow: { marginBottom: 14, shadowColor: '#E5C07B', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 25 },
    avatarImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: 'rgba(229, 192, 123, 0.8)', backgroundColor: '#2a2a2e' },

    name: { color: '#FFF', fontSize: 22, fontWeight: '900', letterSpacing: 2, marginBottom: 3, textAlign: 'center' },
    titleText: { color: '#E5C07B', fontSize: 13, fontWeight: '600', fontStyle: 'italic', letterSpacing: 1, marginBottom: 10 },
    aboutBox: { marginBottom: 14, paddingHorizontal: 8 },
    aboutText: { color: '#A0AAB2', fontSize: 12, textAlign: 'center', fontStyle: 'italic', lineHeight: 18 },

    statsRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%',
        paddingVertical: 14, marginBottom: 10,
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    statItem: { alignItems: 'center', flex: 1 },
    statDivider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.1)' },
    statValue: { color: '#FFF', fontSize: 18, fontWeight: '900', marginBottom: 3 },
    statLabel: { color: '#A0AAB2', fontSize: 9, fontWeight: '700', letterSpacing: 1 },

    infoSection: { width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
    infoDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    infoLabel: { color: '#A0AAB2', fontSize: 11, fontWeight: '600', flex: 1 },
    infoValue: { color: '#FFF', fontSize: 11, fontWeight: 'bold', textAlign: 'right', flexShrink: 1 },

    medalsRow: {
        flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 12,
        backgroundColor: 'rgba(229,192,123,0.04)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(229,192,123,0.12)', marginBottom: 10,
    },
    medalItem: { alignItems: 'center' },
    medalCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
    medalStar: { color: '#FFF', fontSize: 16 },
    medalCount: { fontSize: 16, fontWeight: '900', marginTop: 4 },
    medalLabel: { color: '#A0AAB2', fontSize: 8, fontWeight: '800', letterSpacing: 1.5, marginTop: 2 },

    matchesSection: { width: '100%', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(229, 192, 123, 0.2)' },
    sectionTitle: { color: '#E5C07B', fontSize: 12, fontWeight: '800', letterSpacing: 2, marginBottom: 10, textAlign: 'center' },
    matchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
    matchLeft: { flex: 1.2 },
    matchDate: { color: '#A0AAB2', fontSize: 9, fontWeight: '600' },
    matchRound: { color: '#FFF', fontSize: 10, fontWeight: 'bold', marginTop: 1 },
    matchOpponent: { flex: 1.8, color: '#E5C07B', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
    resultBadge: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
    winBadge: { backgroundColor: 'rgba(74, 222, 128, 0.15)', borderWidth: 1, borderColor: '#4ADE80' },
    lossBadge: { backgroundColor: 'rgba(248, 113, 113, 0.15)', borderWidth: 1, borderColor: '#F87171' },
    resultText: { fontSize: 12, fontWeight: '900' },
    winText: { color: '#4ADE80' },
    lossText: { color: '#F87171' },

    dotBar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8, gap: 4 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)' },
    dotActive: { backgroundColor: '#E5C07B', width: 20, borderRadius: 4 },
});

const obStyles = StyleSheet.create({
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
    touchable: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
    titleBadge: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8, marginBottom: 12 },
    title: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 3 },
    line: { width: 60, height: 1, backgroundColor: 'rgba(229,192,123,0.4)', marginBottom: 36 },
    item: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, paddingHorizontal: 30 },
    arrowBox: { marginRight: 16 },
    arrowCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
    arrowChar: { color: '#000', fontSize: 24, fontWeight: '900' },
    action: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 2 },
    desc: { color: '#A0AAB2', fontSize: 13, fontWeight: '500', marginTop: 3 },
    dismiss: { color: 'rgba(229,192,123,0.5)', fontSize: 12, fontWeight: '600', marginTop: 24, letterSpacing: 2 },
});
