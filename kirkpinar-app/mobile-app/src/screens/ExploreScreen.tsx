import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/GlassCard';
import { theme } from '../theme';
import { MOCK_KIRKPINAR_INFO } from '../utils/mockData';

export const ExploreScreen = () => {
    return (
        <LinearGradient
            colors={['#1a1500', '#0a0a0c', '#000000']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.header}>
                        <Text style={styles.screenTitle}>TARİHÇE & KEŞİF</Text>
                        <View style={styles.divider} />
                    </View>

                    <GlassCard style={styles.historyCard} intensity={20}>
                        <Text style={styles.infoTitle}>KIRKPINAR EFSANESİ</Text>
                        <Text style={styles.infoText}>{MOCK_KIRKPINAR_INFO}</Text>

                        <Text style={[styles.infoTitle, { marginTop: 30 }]}>TURNUVA SİSTEMİ</Text>
                        <Text style={styles.infoText}>
                            - CW Enerji Ligi İlk 24 Doğrudan Katılım{'\n'}
                            - Ön Elemelerden 8 Pehlivan{'\n'}
                            - Toplam 32 Başpehlivanlık Ana Tablosu{'\n'}
                            - Yenişme olmazsa altın puan uygulaması
                        </Text>
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
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#E5C07B',
        letterSpacing: 4,
    },
    divider: {
        width: 40,
        height: 2,
        backgroundColor: '#E5C07B',
        marginTop: 12,
        opacity: 0.5,
    },
    historyCard: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    infoTitle: {
        color: '#E5C07B',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 16,
    },
    infoText: {
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 24,
        fontWeight: '500',
        opacity: 0.9,
    },
});
