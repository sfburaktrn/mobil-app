import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ListRenderItem, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/GlassCard';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../theme';
import { TOURNAMENT_MATCHES, TournamentMatch } from '../utils/mockData';

export const HomeScreen = () => {
    // Record of matchId -> wrestlerIndex (1 or 2)
    const [predictions, setPredictions] = useState<Record<string, number>>({});

    const handlePredict = (matchId: string, wrestlerIndex: number) => {
        setPredictions(prev => ({ ...prev, [matchId]: wrestlerIndex }));
        // TODO: Call Backend Queue API
    };

    const renderMatch: ListRenderItem<TournamentMatch> = ({ item }) => {
        const predictedSide = predictions[item.id];
        return (
            <GlassCard style={styles.matchCard} intensity={25}>
                {/* Top Badge */}
                <View style={styles.badgeRow}>
                    <View style={styles.liveBadge}>
                        <View style={[styles.liveIndicator, { opacity: 0.8 }]} />
                        <Text style={styles.liveText}>EŞLEŞME</Text>
                    </View>
                    <Text style={styles.roundText}>{item.round}</Text>
                </View>

                {/* Gladiators */}
                <View style={styles.vsContainer}>
                    <View style={styles.wrestlerCol}>
                        <View style={styles.avatarGlow}>
                            <Image source={{ uri: item.wrestler1.imageUrl }} style={styles.avatarImage} />
                        </View>
                        <Text style={styles.wrestlerName}>{item.wrestler1.name}</Text>
                        <Text style={styles.wrestlerTitle}>{item.wrestler1.city}</Text>
                    </View>

                    <View style={styles.vsBadge}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>

                    <View style={styles.wrestlerCol}>
                        <View style={styles.avatarGlow}>
                            <Image source={{ uri: item.wrestler2.imageUrl }} style={styles.avatarImage} />
                        </View>
                        <Text style={styles.wrestlerName}>{item.wrestler2.name}</Text>
                        <Text style={styles.wrestlerTitle}>{item.wrestler2.city}</Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.predictionActions}>
                    <CustomButton
                        title={`${item.wrestler1.name.split(' ')[0]}'İ SEÇ`}
                        variant={predictedSide === 1 ? 'primary' : 'outline'}
                        onPress={() => handlePredict(item.id, 1)}
                        style={styles.actionButton}
                    />
                    <CustomButton
                        title={`${item.wrestler2.name.split(' ')[0]}'İ SEÇ`}
                        variant={predictedSide === 2 ? 'primary' : 'outline'}
                        onPress={() => handlePredict(item.id, 2)}
                        style={styles.actionButton}
                    />
                </View>
            </GlassCard>
        );
    };

    return (
        <LinearGradient
            colors={['#1a1500', '#0a0a0c', '#000000']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <FlatList
                    data={TOURNAMENT_MATCHES}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.scrollContent}
                    renderItem={renderMatch}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <View style={styles.header}>
                            <Text style={styles.brandTitle}>KIRKPINAR</Text>
                            <View style={styles.divider} />
                            <Text style={styles.brandSubtitle}>664. TURNUVA - 80 PEHLİVAN</Text>
                        </View>
                    )}
                />
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
        flexGrow: 1,
        padding: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
    },
    brandTitle: {
        fontSize: 38,
        fontFamily: 'System',
        fontWeight: '900',
        color: '#E5C07B', // Soft Premium Gold
        letterSpacing: 8,
        textShadowColor: 'rgba(229, 192, 123, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 15,
    },
    divider: {
        width: 60,
        height: 2,
        backgroundColor: '#E5C07B',
        marginTop: 12,
        marginBottom: 12,
        opacity: 0.5,
    },
    brandSubtitle: {
        fontSize: 12,
        color: '#A0AAB2',
        letterSpacing: 4,
        fontWeight: '600',
    },
    matchCard: {
        marginTop: theme.spacing.md,
    },
    badgeRow: {
        alignItems: 'center',
        marginBottom: 30,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        marginBottom: 16,
    },
    liveIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
        marginRight: 6,
    },
    liveText: {
        color: '#EF4444',
        fontWeight: '800',
        fontSize: 11,
        letterSpacing: 2,
    },
    roundText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
        opacity: 0.9,
    },
    vsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    wrestlerCol: {
        alignItems: 'center',
        flex: 1,
    },
    avatarGlow: {
        shadowColor: '#E5C07B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        marginBottom: 16,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'rgba(229, 192, 123, 0.8)',
    },
    wrestlerName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 4,
    },
    wrestlerTitle: {
        color: '#A0AAB2',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    vsBadge: {
        backgroundColor: '#1A1D24',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    vsText: {
        color: '#A0AAB2',
        fontSize: 16,
        fontWeight: '900',
        fontStyle: 'italic',
    },
    predictionActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
    },
});
