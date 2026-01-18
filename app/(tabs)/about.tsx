import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Target, TreePine } from 'lucide-react-native';
import { useContent } from '@/contexts/ContentContext';
import Colors from '@/constants/colors';

export default function AboutScreen() {
    const { about } = useContent();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/oyhsrvcag9p2in9nmejil' }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.headerTitle}>À propos de FAFA</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Target size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Notre Mission</Text>
                        <Text style={styles.cardText}>{about.mission}</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Heart size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Notre Vision</Text>
                        <Text style={styles.cardText}>{about.vision}</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <TreePine size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Nos Actions</Text>
                        <Text style={styles.cardText}>{about.description}</Text>
                    </View>

                    <View style={styles.valuesSection}>
                        <Text style={styles.valuesTitle}>Nos Valeurs</Text>
                        <View style={styles.valueItem}>
                            <Text style={styles.valueBullet}>🕊️</Text>
                            <Text style={styles.valueText}>Promouvoir la paix et l&apos;harmonie</Text>
                        </View>
                        <View style={styles.valueItem}>
                            <Text style={styles.valueBullet}>🌱</Text>
                            <Text style={styles.valueText}>Protéger l&apos;environnement</Text>
                        </View>
                        <View style={styles.valueItem}>
                            <Text style={styles.valueBullet}>🤝</Text>
                            <Text style={styles.valueText}>Renforcer la solidarité</Text>
                        </View>
                        <View style={styles.valueItem}>
                            <Text style={styles.valueBullet}>📚</Text>
                            <Text style={styles.valueText}>Éduquer les générations futures</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: Colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.dove,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 12,
    },
    cardText: {
        fontSize: 15,
        color: Colors.textLight,
        lineHeight: 22,
    },
    valuesSection: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 20,
        marginTop: 8,
    },
    valuesTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: Colors.white,
        marginBottom: 16,
    },
    valueItem: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginBottom: 12,
    },
    valueBullet: {
        fontSize: 24,
        marginRight: 12,
    },
    valueText: {
        fontSize: 15,
        color: Colors.white,
        flex: 1,
    },
});
