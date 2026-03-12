import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DEMO_USER_ID } from '../config/api';
import { CustomButton } from '../components/CustomButton';
import { GlassCard } from '../components/GlassCard';
import { WrestlerAvatar } from '../components/WrestlerAvatar';
import { fetchUserPredictions, submitPrediction } from '../services/predictions';
import { theme } from '../theme';
import { BracketMatch, buildBracket, getPredictedWinner } from '../utils/bracket';
import { TOURNAMENT_MATCHES } from '../utils/mockData';

const isPlayableMatch = (match: BracketMatch) =>
    Boolean(!match.autoAdvance && match.wrestler1 && match.wrestler2);

export const PredictionsScreen = () => {
    const { width } = useWindowDimensions();
    const isCompact = width < 440;
    const isNarrowActions = width < 520;
    const [predictions, setPredictions] = useState<Record<string, number>>({});
    const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
    const [visibleRoundIndex, setVisibleRoundIndex] = useState(0);
    const [visiblePageIndex, setVisiblePageIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusText, setStatusText] = useState('Turlara dokun, eşleşmeyi seç ve tahminini işle.');
    const [championLocked, setChampionLocked] = useState(false);
    const selectionAnim = useRef(new Animated.Value(0)).current;
    const championPulse = useRef(new Animated.Value(0)).current;
    const championReveal = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(-180)).current;
    const selectionFlash = useRef(new Animated.Value(0)).current;
    const stageTransition = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const hydratePredictions = async () => {
            try {
                const response = await fetchUserPredictions(DEMO_USER_ID);
                const mapped = response.predictions.reduce<Record<string, number>>((acc, item) => {
                    acc[item.matchId] = item.predictedWinnerId;
                    return acc;
                }, {});

                setPredictions(mapped);
                if (response.predictions.length > 0) {
                    setStatusText('Kaydedilmiş tahminlerin yüklendi.');
                }
            } catch (error) {
                setStatusText('Sunucuya erişilemedi. Seçimlerin cihaz üzerinde tutulacak.');
            }
        };

        void hydratePredictions();
    }, []);

    const bracketRounds = useMemo(
        () => buildBracket(TOURNAMENT_MATCHES, predictions),
        [predictions]
    );

    const selectableMatches = useMemo(
        () => bracketRounds.flat().filter(isPlayableMatch),
        [bracketRounds]
    );

    const completedCount = useMemo(
        () => Object.keys(predictions).length,
        [predictions]
    );

    useEffect(() => {
        if (selectableMatches.length === 0) {
            setActiveMatchId(null);
            return;
        }

        const hasActiveMatch = activeMatchId
            ? selectableMatches.some((match) => match.id === activeMatchId)
            : false;

        if (!hasActiveMatch) {
            const firstPending = selectableMatches.find((match) => !predictions[match.id]);
            setActiveMatchId(firstPending?.id ?? selectableMatches[0].id);
        }
    }, [activeMatchId, predictions, selectableMatches]);

    const activeMatch =
        selectableMatches.find((match) => match.id === activeMatchId) ?? selectableMatches[0] ?? null;

    useEffect(() => {
        if (activeMatch) {
            setVisibleRoundIndex(activeMatch.roundIndex);
        }
    }, [activeMatch]);

    const roundMatches = bracketRounds[visibleRoundIndex] ?? [];
    const playableRoundMatches = roundMatches.filter(isPlayableMatch);
    const roundPageSize = visibleRoundIndex < 2 ? (isCompact ? 4 : 6) : 4;
    const totalPages = Math.max(1, Math.ceil(playableRoundMatches.length / roundPageSize));
    const currentPageMatches = playableRoundMatches.slice(
        visiblePageIndex * roundPageSize,
        (visiblePageIndex + 1) * roundPageSize
    );

    useEffect(() => {
        setVisiblePageIndex(0);
    }, [visibleRoundIndex]);

    const championMatch = bracketRounds[bracketRounds.length - 1]?.[0];
    const championPick = championMatch ? getPredictedWinner(championMatch, predictions) : undefined;

    useEffect(() => {
        if (!championPick) {
            championPulse.setValue(0);
            return;
        }

        Animated.loop(
            Animated.sequence([
                Animated.timing(championPulse, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(championPulse, {
                    toValue: 0,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [championPick, championPulse]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 320,
                    duration: 1600,
                    useNativeDriver: true,
                }),
                Animated.delay(500),
                Animated.timing(shimmerAnim, {
                    toValue: -180,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    useEffect(() => {
        stageTransition.setValue(0);
        Animated.timing(stageTransition, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
        }).start();
    }, [visibleRoundIndex, visiblePageIndex, stageTransition]);

    useEffect(() => {
        if (!championLocked) {
            championReveal.setValue(0);
            return;
        }

        Animated.parallel([
            Animated.timing(championReveal, {
                toValue: 1,
                duration: 450,
                useNativeDriver: true,
            }),
        ]).start();
    }, [championLocked, championReveal]);

    if (!activeMatch?.wrestler1 || !activeMatch?.wrestler2) {
        return null;
    }

    const activeMatchIndex = selectableMatches.findIndex((match) => match.id === activeMatch.id);
    const isLastMatch = activeMatchIndex === selectableMatches.length - 1;
    const selectedWinnerId = predictions[activeMatch.id];
    const selectedSide =
        selectedWinnerId === activeMatch.wrestler1.id
            ? 1
            : selectedWinnerId === activeMatch.wrestler2.id
                ? 2
                : 0;

    useEffect(() => {
        selectionAnim.setValue(selectedSide);
    }, [selectedSide, selectionAnim]);

    const leftScale = selectionAnim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, 1.04, 0.98],
    });

    const rightScale = selectionAnim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, 0.98, 1.04],
    });

    const championScale = championPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.05],
    });

    const championHaloOpacity = championPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.18, 0.55],
    });

    const championRevealScale = championReveal.interpolate({
        inputRange: [0, 1],
        outputRange: [0.92, 1],
    });

    const championRevealTranslate = championReveal.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
    });
    const stageTranslateY = stageTransition.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
    });

    const duelAvatarSize = isCompact ? 72 : 82;

    const pickWrestler = (side: 1 | 2) => {
        const winnerId = side === 1 ? activeMatch.wrestler1!.id : activeMatch.wrestler2!.id;
        setPredictions((prev) => ({ ...prev, [activeMatch.id]: winnerId }));
        selectionFlash.setValue(0.9);
        Animated.sequence([
            Animated.timing(selectionFlash, {
                toValue: 0.35,
                duration: 110,
                useNativeDriver: true,
            }),
            Animated.timing(selectionFlash, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start();
        Animated.spring(selectionAnim, {
            toValue: side,
            friction: 8,
            tension: 90,
            useNativeDriver: true,
        }).start();
    };

    const moveToMatch = (offset: number) => {
        const targetIndex = activeMatchIndex + offset;
        if (targetIndex >= 0 && targetIndex < selectableMatches.length) {
            setActiveMatchId(selectableMatches[targetIndex].id);
        }
    };

    const handleSubmit = async () => {
        if (!selectedWinnerId) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await submitPrediction({
                userId: DEMO_USER_ID,
                matchId: activeMatch.id,
                predictedWinnerId: selectedWinnerId,
            });

            if (isLastMatch) {
                const finalWinnerName =
                    selectedWinnerId === activeMatch.wrestler1!.id
                        ? activeMatch.wrestler1!.name
                        : activeMatch.wrestler2!.name;
                setChampionLocked(true);
                setVisibleRoundIndex(bracketRounds.length - 1);
                setStatusText(`${finalWinnerName} başpehlivan tahminin olarak kaydedildi.`);
            } else {
                setStatusText(response.message);
            }
        } catch (error) {
            setStatusText('Sunucuya kaydedilemedi. Seçim yerelde tutuldu.');
        } finally {
            setIsSubmitting(false);
            if (!isLastMatch) {
                moveToMatch(1);
            }
        }
    };

    const renderMiniMatchCard = (match: BracketMatch) => {
        const predictedWinner = getPredictedWinner(match, predictions);
        const isActive = activeMatch.id === match.id;

        return (
            <Pressable
                key={match.id}
                onPress={() => setActiveMatchId(match.id)}
                style={[
                    styles.roundMatchCard,
                    isActive && styles.roundMatchCardActive,
                ]}
            >
                <Text style={styles.roundMatchBadge}>Maç {match.matchNumber}</Text>
                <View
                    style={[
                        styles.roundParticipant,
                        predictedWinner?.id === match.wrestler1?.id && styles.roundParticipantWinner,
                    ]}
                >
                    <WrestlerAvatar wrestler={match.wrestler1!} size={30} />
                    <Text style={styles.roundParticipantName} numberOfLines={1}>
                        {match.wrestler1!.name}
                    </Text>
                </View>
                <View
                    style={[
                        styles.roundParticipant,
                        predictedWinner?.id === match.wrestler2?.id && styles.roundParticipantWinner,
                    ]}
                >
                    <WrestlerAvatar wrestler={match.wrestler2!} size={30} />
                    <Text style={styles.roundParticipantName} numberOfLines={1}>
                        {match.wrestler2!.name}
                    </Text>
                </View>
            </Pressable>
        );
    };

    const renderFocusedRoundScene = () => {
        if (currentPageMatches.length === 0) {
            return (
                <GlassCard style={styles.emptyRoundCard} intensity={16}>
                    <Text style={styles.emptyRoundTitle}>Bu tur için maç görünmüyor</Text>
                    <Text style={styles.emptyRoundText}>
                        Önceki turlardaki seçimlerin tamamlandığında bu turdaki eşleşmeler burada oluşacak.
                    </Text>
                </GlassCard>
            );
        }

        if (currentPageMatches.length <= 4) {
            const leftSide = currentPageMatches.slice(0, Math.ceil(currentPageMatches.length / 2));
            const rightSide = currentPageMatches.slice(Math.ceil(currentPageMatches.length / 2));

            return (
                <View style={[styles.eliteStageRow, isCompact && styles.eliteStageRowCompact]}>
                    <View style={styles.eliteColumn}>
                        {leftSide.map(renderMiniMatchCard)}
                    </View>

                    <View style={styles.finalLane}>
                        <Text style={styles.finalLaneTitle}>Final Yolu</Text>
                        <Animated.View
                            style={[
                                styles.finalLaneCardWrap,
                                championPick && { transform: [{ scale: championScale }] },
                            ]}
                        >
                            {championPick ? (
                                <Animated.View
                                    style={[
                                        styles.finalHalo,
                                        { opacity: championHaloOpacity },
                                    ]}
                                />
                            ) : null}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.06)']}
                                style={styles.finalLaneCard}
                            >
                                {championPick ? (
                                    <Animated.View
                                        pointerEvents="none"
                                        style={[
                                            styles.finalShimmerOverlay,
                                            { transform: [{ translateX: shimmerAnim }, { rotate: '-16deg' }] },
                                        ]}
                                    />
                                ) : null}
                                <Text style={styles.finalLaneBadge}>ALTIN KEMER</Text>
                                {championPick ? (
                                    <>
                                        <WrestlerAvatar wrestler={championPick} size={72} />
                                        <Text style={styles.finalLaneName} numberOfLines={2}>
                                            {championPick.name}
                                        </Text>
                                        <Text style={styles.finalLaneSubtext}>Başpehlivan tahminin hazır</Text>
                                    </>
                                ) : (
                                    <Text style={styles.finalLaneWaiting}>
                                        Final seçimi tamamlanınca başpehlivan burada parlayacak.
                                    </Text>
                                )}
                            </LinearGradient>
                        </Animated.View>
                    </View>

                    <View style={styles.eliteColumn}>
                        {rightSide.map(renderMiniMatchCard)}
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.roundGrid}>
                {currentPageMatches.map(renderMiniMatchCard)}
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#07110C', '#0D1712', '#020504']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.eyebrow}>TAHMİN MERKEZİ</Text>
                        <Text style={[styles.title, isCompact && styles.titleCompact]}>
                            Gerçek akışa yakın, mobilde kullanışlı tahmin sahnesi.
                        </Text>
                        <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>
                            Turları sırayla takip et, eşleşmeye dokun ve tahminini işle. Son turlarda final yolu sahneye dönüşür.
                        </Text>
                    </View>

                    <GlassCard style={styles.progressCard} intensity={18}>
                        <View style={styles.progressRow}>
                            <View>
                                <Text style={styles.progressLabel}>Tamamlanan tahmin</Text>
                                <Text style={styles.progressValue}>
                                    {completedCount} / {selectableMatches.length}
                                </Text>
                            </View>
                            <View style={styles.progressBadge}>
                                <Text style={styles.progressBadgeText}>{activeMatch.roundLabel}</Text>
                            </View>
                        </View>
                        <View style={styles.progressBarTrack}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${(completedCount / Math.max(selectableMatches.length, 1)) * 100}%` },
                                ]}
                            />
                        </View>
                    </GlassCard>

                    <LinearGradient
                        colors={['#0A1F7A', '#1037C7', '#09144D']}
                        style={styles.stageBoard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.stageGlowTop} />
                        <View style={styles.stageGlowBottom} />
                        <Text style={styles.stageEyebrow}>665. TARİHİ KIRKPINAR</Text>
                        <Text style={styles.stageTitle}>TUR SAHNESİ</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roundTabs}>
                            {bracketRounds.map((round, index) => (
                                <Pressable
                                    key={`round-tab-${index}`}
                                    onPress={() => setVisibleRoundIndex(index)}
                                    style={[
                                        styles.roundTab,
                                        visibleRoundIndex === index && styles.roundTabActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.roundTabText,
                                            visibleRoundIndex === index && styles.roundTabTextActive,
                                        ]}
                                    >
                                        {round[0]?.roundLabel ?? `Tur ${index + 1}`}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <View style={styles.stageMetaRow}>
                            <Text style={styles.stageMetaText}>
                                {roundMatches[0]?.roundLabel ?? 'Tur'} / Sayfa {visiblePageIndex + 1} / {totalPages}
                            </Text>
                            {totalPages > 1 ? (
                                <View style={styles.pageControls}>
                                    <Pressable
                                        onPress={() => setVisiblePageIndex((prev) => Math.max(0, prev - 1))}
                                        style={[styles.pageButton, visiblePageIndex === 0 && styles.pageButtonDisabled]}
                                        disabled={visiblePageIndex === 0}
                                    >
                                        <Text style={styles.pageButtonText}>Önceki</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => setVisiblePageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
                                        style={[styles.pageButton, visiblePageIndex >= totalPages - 1 && styles.pageButtonDisabled]}
                                        disabled={visiblePageIndex >= totalPages - 1}
                                    >
                                        <Text style={styles.pageButtonText}>Sonraki</Text>
                                    </Pressable>
                                </View>
                            ) : null}
                        </View>

                        <Animated.View
                            style={[
                                styles.stageSceneAnimated,
                                {
                                    opacity: stageTransition,
                                    transform: [{ translateY: stageTranslateY }],
                                },
                            ]}
                        >
                            {renderFocusedRoundScene()}
                        </Animated.View>
                    </LinearGradient>

                    <GlassCard style={styles.matchCard} intensity={20}>
                        <LinearGradient
                            colors={['rgba(243,229,171,0.16)', 'rgba(243,229,171,0)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.matchCardAccent}
                        />
                        <View style={styles.selectionBadge}>
                            <Text style={styles.selectionBadgeText}>PEHLİVAN SEÇİMİ</Text>
                        </View>
                        <Text style={styles.roundText}>{activeMatch.roundLabel}</Text>
                        <Text style={styles.matchTitle}>Seçili Eşleşme</Text>

                        <View style={[styles.duelRow, isCompact && styles.duelRowCompact]}>
                            <Pressable style={styles.duelSlot} onPress={() => pickWrestler(1)}>
                                <Animated.View
                                    style={[
                                        styles.choiceCard,
                                        selectedSide === 1 && styles.choiceCardSelected,
                                        { transform: [{ scale: leftScale }] },
                                    ]}
                                >
                                    {selectedSide === 1 ? (
                                        <Animated.View
                                            pointerEvents="none"
                                            style={[
                                                styles.flashOverlay,
                                                { opacity: selectionFlash },
                                            ]}
                                        />
                                    ) : null}
                                    {selectedSide === 1 ? (
                                        <Animated.View
                                            pointerEvents="none"
                                            style={[
                                                styles.shimmerOverlay,
                                                { transform: [{ translateX: shimmerAnim }, { rotate: '-18deg' }] },
                                            ]}
                                        />
                                    ) : null}
                                    <WrestlerAvatar wrestler={activeMatch.wrestler1} size={duelAvatarSize} />
                                    <Text style={styles.wrestlerName}>{activeMatch.wrestler1.name}</Text>
                                    <Text style={styles.wrestlerMeta}>
                                        {activeMatch.wrestler1.city} / {activeMatch.wrestler1.championships === 'Yok'
                                            ? 'Yeni nesil'
                                            : `Şampiyon: ${activeMatch.wrestler1.championships}`}
                                    </Text>
                                    <View style={styles.statsRow}>
                                        <View style={styles.statChip}>
                                            <Text style={styles.statChipText}>%{activeMatch.wrestler1.winRate}</Text>
                                        </View>
                                        <View style={styles.statChip}>
                                            <Text style={styles.statChipText}>{activeMatch.wrestler1.weight} kg</Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            </Pressable>

                            <View style={styles.centerBadge}>
                                <Text style={styles.centerBadgeText}>VS</Text>
                            </View>

                            <Pressable style={styles.duelSlot} onPress={() => pickWrestler(2)}>
                                <Animated.View
                                    style={[
                                        styles.choiceCard,
                                        selectedSide === 2 && styles.choiceCardSelected,
                                        { transform: [{ scale: rightScale }] },
                                    ]}
                                >
                                    {selectedSide === 2 ? (
                                        <Animated.View
                                            pointerEvents="none"
                                            style={[
                                                styles.flashOverlay,
                                                { opacity: selectionFlash },
                                            ]}
                                        />
                                    ) : null}
                                    {selectedSide === 2 ? (
                                        <Animated.View
                                            pointerEvents="none"
                                            style={[
                                                styles.shimmerOverlay,
                                                { transform: [{ translateX: shimmerAnim }, { rotate: '-18deg' }] },
                                            ]}
                                        />
                                    ) : null}
                                    <WrestlerAvatar wrestler={activeMatch.wrestler2} size={duelAvatarSize} />
                                    <Text style={styles.wrestlerName}>{activeMatch.wrestler2.name}</Text>
                                    <Text style={styles.wrestlerMeta}>
                                        {activeMatch.wrestler2.city} / {activeMatch.wrestler2.championships === 'Yok'
                                            ? 'Sürpriz aday'
                                            : `Şampiyon: ${activeMatch.wrestler2.championships}`}
                                    </Text>
                                    <View style={styles.statsRow}>
                                        <View style={styles.statChip}>
                                            <Text style={styles.statChipText}>%{activeMatch.wrestler2.winRate}</Text>
                                        </View>
                                        <View style={styles.statChip}>
                                            <Text style={styles.statChipText}>{activeMatch.wrestler2.weight} kg</Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            </Pressable>
                        </View>

                        <Text style={styles.selectionHint}>
                            {selectedSide === 0
                                ? 'Kazananı seç, sonra tahminini işle.'
                                : selectedSide === 1
                                    ? `${activeMatch.wrestler1.name} tur atlıyor.`
                                    : `${activeMatch.wrestler2.name} tur atlıyor.`}
                        </Text>

                        <View style={[styles.actionRow, isNarrowActions && styles.actionRowCompact]}>
                            <CustomButton
                                title="Önceki"
                                variant="outline"
                                onPress={() => moveToMatch(-1)}
                                disabled={activeMatchIndex <= 0}
                                style={styles.actionButton}
                            />
                            <CustomButton
                                title={isLastMatch ? 'Başpehlivanı Onayla' : 'Tahmini İşle'}
                                onPress={handleSubmit}
                                disabled={selectedSide === 0 || isSubmitting}
                                loading={isSubmitting}
                                style={styles.actionButton}
                            />
                            <CustomButton
                                title={isLastMatch ? 'Tamamlandı' : 'Sonraki'}
                                variant="secondary"
                                onPress={() => moveToMatch(1)}
                                disabled={isLastMatch}
                                style={styles.actionButton}
                            />
                        </View>

                        <Text style={styles.backendStatus}>{statusText}</Text>
                    </GlassCard>

                    {championPick ? (
                        <Animated.View
                            style={[
                                styles.championRevealWrap,
                                championLocked && {
                                    opacity: championReveal,
                                    transform: [
                                        { translateY: championRevealTranslate },
                                        { scale: championRevealScale },
                                    ],
                                },
                            ]}
                        >
                        <GlassCard style={styles.championLockCard} intensity={18}>
                            <Text style={styles.championLockEyebrow}>
                                {championLocked ? 'BAŞPEHLİVAN SEÇİMİ TAMAMLANDI' : 'OLASI BAŞPEHLİVAN'}
                            </Text>
                            <View style={[styles.championLockRow, isCompact && styles.championLockRowCompact]}>
                                <WrestlerAvatar wrestler={championPick} size={72} />
                                <View style={styles.championLockInfo}>
                                    <Text style={styles.championLockName}>{championPick.name}</Text>
                                    <Text style={styles.championLockMeta}>
                                        {championPick.city} / {championPick.championships === 'Yok'
                                            ? 'Yeni kemer adayı'
                                            : `Şampiyonlukları: ${championPick.championships}`}
                                    </Text>
                                </View>
                            </View>
                        </GlassCard>
                        </Animated.View>
                    ) : null}
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
    header: {
        marginBottom: theme.spacing.lg,
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
    },
    subtitleCompact: {
        fontSize: 14,
        lineHeight: 20,
    },
    progressCard: {
        marginBottom: theme.spacing.lg,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    progressLabel: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    progressValue: {
        color: theme.colors.primaryLight,
        fontSize: 24,
        fontWeight: '900',
        marginTop: theme.spacing.xs,
    },
    progressBadge: {
        borderRadius: theme.borderRadius.full,
        backgroundColor: 'rgba(94, 122, 67, 0.2)',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    progressBadgeText: {
        color: theme.colors.olive,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    progressBarTrack: {
        height: 10,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.cardMuted,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 10,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.primary,
    },
    championCard: {
        marginBottom: theme.spacing.lg,
    },
    stageBoard: {
        borderRadius: theme.borderRadius.xl,
        paddingVertical: theme.spacing.xl,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        overflow: 'hidden',
        position: 'relative',
    },
    stageGlowTop: {
        position: 'absolute',
        width: 260,
        height: 160,
        borderRadius: 130,
        backgroundColor: 'rgba(61, 122, 255, 0.18)',
        top: -40,
        alignSelf: 'center',
    },
    stageGlowBottom: {
        position: 'absolute',
        width: 220,
        height: 120,
        borderRadius: 110,
        backgroundColor: 'rgba(214, 175, 55, 0.12)',
        bottom: -28,
        alignSelf: 'center',
    },
    stageEyebrow: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.4,
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
    },
    stageTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    roundTabs: {
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
    },
    roundTab: {
        borderRadius: theme.borderRadius.full,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.14)',
    },
    roundTabActive: {
        backgroundColor: 'rgba(243, 229, 171, 0.18)',
        borderColor: '#F3E5AB',
    },
    roundTabText: {
        color: 'rgba(255,255,255,0.82)',
        fontSize: 12,
        fontWeight: '700',
    },
    roundTabTextActive: {
        color: '#FFFFFF',
    },
    stageMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    stageMetaText: {
        color: 'rgba(255,255,255,0.72)',
        fontSize: 12,
        fontWeight: '700',
    },
    pageControls: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
    },
    pageButton: {
        borderRadius: theme.borderRadius.full,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    pageButtonDisabled: {
        opacity: 0.4,
    },
    pageButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },
    eliteStageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    eliteStageRowCompact: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    eliteColumn: {
        flex: 1,
        gap: theme.spacing.sm,
    },
    finalLaneTitle: {
        color: 'rgba(255,255,255,0.92)',
        fontSize: 12,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    roundGrid: {
        gap: theme.spacing.sm,
    },
    roundMatchCard: {
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.24)',
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        marginBottom: theme.spacing.sm,
    },
    roundMatchCardActive: {
        borderColor: '#F3E5AB',
        backgroundColor: 'rgba(243, 229, 171, 0.18)',
    },
    roundMatchBadge: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 11,
        fontWeight: '800',
        marginBottom: theme.spacing.xs,
    },
    roundParticipant: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.09)',
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 6,
        marginTop: theme.spacing.xs,
    },
    roundParticipantWinner: {
        backgroundColor: 'rgba(243, 229, 171, 0.2)',
        borderWidth: 1,
        borderColor: '#F3E5AB',
    },
    roundParticipantName: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    finalLane: {
        width: 164,
        alignItems: 'center',
    },
    finalLaneCardWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    finalNodeAnimatedWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    finalHalo: {
        position: 'absolute',
        width: 176,
        height: 176,
        borderRadius: 88,
        backgroundColor: 'rgba(243, 229, 171, 0.28)',
    },
    finalLaneCard: {
        width: 148,
        minHeight: 248,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
        shadowColor: '#F3E5AB',
        shadowOpacity: 0.28,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 18,
        overflow: 'hidden',
    },
    finalShimmerOverlay: {
        position: 'absolute',
        top: -20,
        left: 0,
        width: 72,
        height: 320,
        backgroundColor: 'rgba(255,255,255,0.18)',
    },
    finalLaneBadge: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: theme.spacing.md,
    },
    finalChampionWrap: {
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    finalLaneName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 20,
    },
    finalLaneSubtext: {
        color: '#F3E5AB',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.4,
        textAlign: 'center',
    },
    finalLaneWaiting: {
        color: 'rgba(255,255,255,0.72)',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    stageSceneAnimated: {
        width: '100%',
    },
    emptyRoundCard: {
        marginTop: theme.spacing.sm,
    },
    emptyRoundTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '800',
        marginBottom: theme.spacing.sm,
    },
    emptyRoundText: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },
    matchCard: {
        marginBottom: theme.spacing.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    matchCardAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 68,
    },
    selectionBadge: {
        alignSelf: 'flex-start',
        borderRadius: theme.borderRadius.full,
        backgroundColor: 'rgba(243,229,171,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(243,229,171,0.2)',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        marginBottom: theme.spacing.sm,
    },
    selectionBadgeText: {
        color: theme.colors.primaryLight,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.2,
    },
    roundText: {
        color: theme.colors.olive,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: theme.spacing.xs,
    },
    matchTitle: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '900',
        marginBottom: theme.spacing.md,
    },
    duelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    duelRowCompact: {
        flexDirection: 'column',
    },
    duelSlot: {
        flex: 1,
        alignSelf: 'stretch',
    },
    choiceCard: {
        alignItems: 'center',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.md,
        minHeight: 190,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
    },
    choiceCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.28,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 18,
    },
    flashOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(243,229,171,0.32)',
    },
    shimmerOverlay: {
        position: 'absolute',
        top: -10,
        left: 0,
        width: 54,
        height: 260,
        backgroundColor: 'rgba(243,229,171,0.22)',
    },
    centerBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    centerBadgeCompact: {
        marginVertical: theme.spacing.xs,
    },
    centerBadgeText: {
        color: theme.colors.primary,
        fontSize: 13,
        fontWeight: '900',
    },
    wrestlerName: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: '800',
        textAlign: 'center',
        marginTop: theme.spacing.sm,
    },
    wrestlerMeta: {
        color: theme.colors.textSecondary,
        fontSize: 11,
        lineHeight: 16,
        textAlign: 'center',
        marginTop: theme.spacing.xs,
        minHeight: 30,
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.sm,
    },
    statChip: {
        borderRadius: theme.borderRadius.full,
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    statChipText: {
        color: theme.colors.primaryLight,
        fontSize: 10,
        fontWeight: '800',
    },
    selectionHint: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        lineHeight: 18,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    actionRowCompact: {
        flexDirection: 'column',
    },
    actionButton: {
        flex: 1,
    },
    backendStatus: {
        color: theme.colors.textMuted,
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
        marginTop: theme.spacing.md,
    },
    championRevealWrap: {
        marginTop: theme.spacing.lg,
    },
    championLockCard: {
        marginBottom: theme.spacing.xl,
    },
    championLockEyebrow: {
        color: theme.colors.primary,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.4,
        marginBottom: theme.spacing.md,
    },
    championLockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    championLockRowCompact: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    championLockInfo: {
        flex: 1,
    },
    championLockName: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '900',
        marginBottom: theme.spacing.xs,
    },
    championLockMeta: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '800',
    },
    sectionMeta: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
    },
    summaryCard: {
        marginBottom: theme.spacing.sm,
    },
});
