import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContent } from '@/contexts/ContentContext';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 2;

export default function GalleryScreen() {
    const { gallery, isLoading } = useContent();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Galerie Photos</Text>
                <Text style={styles.headerSubtitle}>Nos actions en images</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {isLoading ? (
                        <Text style={styles.loadingText}>Chargement...</Text>
                    ) : gallery.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTitle}>Galerie vide</Text>
                            <Text style={styles.emptyText}>Aucune photo pour le moment.</Text>
                            <Text style={styles.emptyText}>Les photos seront ajoutées par l&apos;administrateur.</Text>
                        </View>
                    ) : (
                        <View style={styles.grid}>
                            {gallery.map((item: { id: string; imageUrl: string; caption: string }) => (
                                <View key={item.id} style={styles.imageContainer}>
                                    <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
                                    {item.caption && (
                                        <View style={styles.captionContainer}>
                                            <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
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
    headerTitle: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: Colors.primary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textLight,
        marginTop: 4,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    grid: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        gap: 16,
    },
    imageContainer: {
        width: imageSize,
        marginBottom: 16,
        backgroundColor: Colors.white,
        borderRadius: 12,
        overflow: 'hidden' as const,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: imageSize,
    },
    captionContainer: {
        padding: 12,
    },
    caption: {
        fontSize: 13,
        color: Colors.text,
        lineHeight: 18,
    },
    loadingText: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center' as const,
        marginTop: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 15,
        color: Colors.textLight,
        textAlign: 'center' as const,
        marginTop: 4,
    },
});
