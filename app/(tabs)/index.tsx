import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, User } from 'lucide-react-native';
import { useContent } from '@/contexts/ContentContext';
import Colors from '@/constants/colors';
import type { Article } from '@/types/content';

export default function HomeScreen() {
    const { articles, quotes, isLoading } = useContent();
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const renderArticle = (article: Article) => (
        <View key={article.id} style={styles.articleCard}>
            {article.imageUrl && (
                <Image source={{ uri: article.imageUrl }} style={styles.articleImage} resizeMode="cover" />
            )}
            <View style={styles.articleContent}>
                <View style={styles.articleTag}>
                    <Text style={styles.articleTagText}>
                        {article.type === 'action' ? '🌱 Action' : '📰 Actualité'}
                    </Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleText}>{article.content}</Text>
                <View style={styles.articleMeta}>
                    <View style={styles.metaItem}>
                        <User size={14} color={Colors.textLight} />
                        <Text style={styles.metaText}>{article.author}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Calendar size={14} color={Colors.textLight} />
                        <Text style={styles.metaText}>{formatDate(article.createdAt)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const randomQuote = quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/oyhsrvcag9p2in9nmejil' }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.headerTitle}>FAFA</Text>
                <Text style={styles.headerSubtitle}>Graines de Paix</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                }
            >
                {randomQuote && (
                    <View style={styles.quoteCard}>
                        <Text style={styles.quoteText}>&ldquo;{randomQuote.text}&rdquo;</Text>
                        <Text style={styles.quoteAuthor}>— {randomQuote.author}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fil d&apos;actualité</Text>
                    {isLoading ? (
                        <Text style={styles.loadingText}>Chargement...</Text>
                    ) : articles.length === 0 ? (
                        <Text style={styles.emptyText}>Aucune actualité pour le moment</Text>
                    ) : (
                        articles.map(renderArticle)
                    )}
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
        width: 80,
        height: 80,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: Colors.primary,
        letterSpacing: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textLight,
        marginTop: 2,
    },
    scrollView: {
        flex: 1,
    },
    quoteCard: {
        backgroundColor: Colors.dove,
        margin: 16,
        padding: 20,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    quoteText: {
        fontSize: 16,
        fontStyle: 'italic' as const,
        color: Colors.text,
        lineHeight: 24,
        marginBottom: 8,
    },
    quoteAuthor: {
        fontSize: 14,
        color: Colors.textLight,
        textAlign: 'right' as const,
    },
    section: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 16,
    },
    articleCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden' as const,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    articleImage: {
        width: '100%',
        height: 200,
    },
    articleContent: {
        padding: 16,
    },
    articleTag: {
        alignSelf: 'flex-start' as const,
        backgroundColor: Colors.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
    },
    articleTagText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: Colors.white,
    },
    articleTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 8,
    },
    articleText: {
        fontSize: 15,
        color: Colors.textLight,
        lineHeight: 22,
        marginBottom: 12,
    },
    articleMeta: {
        flexDirection: 'row' as const,
        gap: 16,
        marginTop: 8,
    },
    metaItem: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 6,
    },
    metaText: {
        fontSize: 13,
        color: Colors.textLight,
    },
    loadingText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center' as const,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center' as const,
        marginTop: 20,
    },
});
