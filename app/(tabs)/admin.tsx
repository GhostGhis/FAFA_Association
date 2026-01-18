import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Plus, LogOut, Upload, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useContent } from '@/contexts/ContentContext';
import Colors from '@/constants/colors';
import type { Article, GalleryItem, Quote } from '@/types/content';

export default function AdminScreen() {
    const { isAdmin, verifyAdmin, setIsAdmin, addArticle, addGalleryItem, addQuote, updatePin } = useContent();
    const [pin, setPin] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [articleForm, setArticleForm] = useState<{
        title: string;
        content: string;
        imageUrl: string;
        type: 'news' | 'action';
    }>({
        title: '',
        content: '',
        imageUrl: '',
        type: 'news',
    });

    const [galleryForm, setGalleryForm] = useState({
        images: [] as string[],
        caption: '',
    });

    const [quoteForm, setQuoteForm] = useState({
        text: '',
        author: '',
    });

    const [pinForm, setPinForm] = useState({
        currentPin: '',
        newPin: '',
        confirmPin: '',
    });

    const handleLogin = async () => {
        if (!pin.trim()) {
            Alert.alert('Erreur', 'Veuillez entrer un code PIN');
            return;
        }

        setIsLoading(true);
        try {
            const isValid = await verifyAdmin(pin);
            if (!isValid) {
                Alert.alert('Erreur', 'Code PIN incorrect');
            }
        } catch {
            Alert.alert('Erreur', 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAdmin(false);
        setPin('');
    };

    const pickArticleImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            setArticleForm({ ...articleForm, imageUrl: `data:image/jpeg;base64,${result.assets[0].base64}` });
        }
    };

    const handleAddArticle = async () => {
        if (!articleForm.title.trim() || !articleForm.content.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
            return;
        }

        const newArticle: Article = {
            id: Date.now().toString(),
            title: articleForm.title,
            content: articleForm.content,
            imageUrl: articleForm.imageUrl || undefined,
            type: articleForm.type,
            author: 'FAFA Admin',
            createdAt: Date.now(),
        };

        await addArticle(newArticle);
        setArticleForm({ title: '', content: '', imageUrl: '', type: 'news' });
        Alert.alert('Succès', 'Article ajouté avec succès');
    };

    const pickGalleryImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled) {
            const images = result.assets.map(asset =>
                asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : ''
            ).filter(Boolean);
            setGalleryForm({ ...galleryForm, images: [...galleryForm.images, ...images] });
        }
    };

    const removeGalleryImage = (index: number) => {
        const updated = galleryForm.images.filter((_, i) => i !== index);
        setGalleryForm({ ...galleryForm, images: updated });
    };

    const handleAddGalleryItem = async () => {
        if (galleryForm.images.length === 0) {
            Alert.alert('Erreur', 'Veuillez ajouter au moins une image');
            return;
        }

        for (const imageUrl of galleryForm.images) {
            const newItem: GalleryItem = {
                id: `${Date.now()}_${Math.random()}`,
                imageUrl,
                caption: galleryForm.caption,
                createdAt: Date.now(),
            };
            await addGalleryItem(newItem);
        }

        setGalleryForm({ images: [], caption: '' });
        Alert.alert('Succès', `${galleryForm.images.length} photo(s) ajoutée(s) à la galerie`);
    };

    const handleAddQuote = async () => {
        if (!quoteForm.text.trim() || !quoteForm.author.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        const newQuote: Quote = {
            id: Date.now().toString(),
            text: quoteForm.text,
            author: quoteForm.author,
            createdAt: Date.now(),
        };

        await addQuote(newQuote);
        setQuoteForm({ text: '', author: '' });
        Alert.alert('Succès', 'Citation ajoutée avec succès');
    };

    const handleChangePin = async () => {
        if (!pinForm.currentPin.trim() || !pinForm.newPin.trim() || !pinForm.confirmPin.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (pinForm.newPin !== pinForm.confirmPin) {
            Alert.alert('Erreur', 'Les nouveaux codes PIN ne correspondent pas');
            return;
        }

        if (pinForm.newPin.length < 4) {
            Alert.alert('Erreur', 'Le code PIN doit contenir au moins 4 chiffres');
            return;
        }

        const isCurrentValid = await verifyAdmin(pinForm.currentPin);
        if (!isCurrentValid) {
            Alert.alert('Erreur', 'Code PIN actuel incorrect');
            setIsAdmin(true);
            return;
        }

        await updatePin(pinForm.newPin);
        setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
        Alert.alert('Succès', 'Code PIN modifié avec succès');
    };

    if (!isAdmin) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.loginContainer}
                >
                    <View style={styles.loginBox}>
                        <View style={styles.lockIcon}>
                            <Lock size={48} color={Colors.primary} />
                        </View>
                        <Text style={styles.loginTitle}>Espace Administrateur</Text>
                        <Text style={styles.loginSubtitle}>Entrez votre code PIN pour continuer</Text>

                        <TextInput
                            style={styles.pinInput}
                            value={pin}
                            onChangeText={setPin}
                            placeholder="Code PIN"
                            secureTextEntry
                            keyboardType="number-pad"
                            maxLength={6}
                        />

                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <Text style={styles.loginButtonText}>
                                {isLoading ? 'Connexion...' : 'Se connecter'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.loginNote}>
                            Code PIN par défaut : 19470
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Espace Admin</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <LogOut size={20} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ajouter un Article</Text>
                        <TextInput
                            style={styles.input}
                            value={articleForm.title}
                            onChangeText={(text) => setArticleForm({ ...articleForm, title: text })}
                            placeholder="Titre de l'article"
                            placeholderTextColor={Colors.textLight}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={articleForm.content}
                            onChangeText={(text) => setArticleForm({ ...articleForm, content: text })}
                            placeholder="Contenu de l'article"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={4}
                        />
                        <TouchableOpacity style={styles.uploadButton} onPress={pickArticleImage}>
                            <Upload size={20} color={Colors.primary} />
                            <Text style={styles.uploadButtonText}>Ajouter une image (optionnel)</Text>
                        </TouchableOpacity>
                        {articleForm.imageUrl ? (
                            <View style={styles.imagePreview}>
                                <Image source={{ uri: articleForm.imageUrl }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => setArticleForm({ ...articleForm, imageUrl: '' })}
                                >
                                    <X size={16} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                        <View style={styles.typeSelector}>
                            <TouchableOpacity
                                style={[styles.typeButton, articleForm.type === 'news' && styles.typeButtonActive]}
                                onPress={() => setArticleForm({ ...articleForm, type: 'news' })}
                            >
                                <Text style={[styles.typeButtonText, articleForm.type === 'news' && styles.typeButtonTextActive]}>
                                    Actualité
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.typeButton, articleForm.type === 'action' && styles.typeButtonActive]}
                                onPress={() => setArticleForm({ ...articleForm, type: 'action' })}
                            >
                                <Text style={[styles.typeButtonText, articleForm.type === 'action' && styles.typeButtonTextActive]}>
                                    Action
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddArticle}>
                            <Plus size={20} color={Colors.white} />
                            <Text style={styles.addButtonText}>Publier l&apos;article</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ajouter des Photos</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={pickGalleryImages}>
                            <Upload size={20} color={Colors.primary} />
                            <Text style={styles.uploadButtonText}>Sélectionner des images</Text>
                        </TouchableOpacity>
                        {galleryForm.images.length > 0 ? (
                            <View style={styles.imagesGrid}>
                                {galleryForm.images.map((uri, index) => (
                                    <View key={index} style={styles.imagePreview}>
                                        <Image source={{ uri }} style={styles.previewImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeGalleryImage(index)}
                                        >
                                            <X size={16} color={Colors.white} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        ) : null}
                        <TextInput
                            style={styles.input}
                            value={galleryForm.caption}
                            onChangeText={(text) => setGalleryForm({ ...galleryForm, caption: text })}
                            placeholder="Légende (optionnel)"
                            placeholderTextColor={Colors.textLight}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddGalleryItem}>
                            <Plus size={20} color={Colors.white} />
                            <Text style={styles.addButtonText}>Ajouter à la galerie ({galleryForm.images.length})</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ajouter une Citation</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={quoteForm.text}
                            onChangeText={(text) => setQuoteForm({ ...quoteForm, text })}
                            placeholder="Texte de la citation"
                            placeholderTextColor={Colors.textLight}
                            multiline
                            numberOfLines={3}
                        />
                        <TextInput
                            style={styles.input}
                            value={quoteForm.author}
                            onChangeText={(text) => setQuoteForm({ ...quoteForm, author: text })}
                            placeholder="Auteur"
                            placeholderTextColor={Colors.textLight}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddQuote}>
                            <Plus size={20} color={Colors.white} />
                            <Text style={styles.addButtonText}>Ajouter la citation</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Paramètres du compte</Text>
                        <Text style={styles.sectionSubtitle}>Modifier le code PIN</Text>
                        <TextInput
                            style={styles.input}
                            value={pinForm.currentPin}
                            onChangeText={(text) => setPinForm({ ...pinForm, currentPin: text })}
                            placeholder="Code PIN actuel"
                            placeholderTextColor={Colors.textLight}
                            secureTextEntry
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                        <TextInput
                            style={styles.input}
                            value={pinForm.newPin}
                            onChangeText={(text) => setPinForm({ ...pinForm, newPin: text })}
                            placeholder="Nouveau code PIN"
                            placeholderTextColor={Colors.textLight}
                            secureTextEntry
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                        <TextInput
                            style={styles.input}
                            value={pinForm.confirmPin}
                            onChangeText={(text) => setPinForm({ ...pinForm, confirmPin: text })}
                            placeholder="Confirmer le nouveau code PIN"
                            placeholderTextColor={Colors.textLight}
                            secureTextEntry
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleChangePin}>
                            <Lock size={20} color={Colors.white} />
                            <Text style={styles.addButtonText}>Modifier le code PIN</Text>
                        </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    logoutButton: {
        padding: 8,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    loginBox: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    lockIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.dove,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 8,
    },
    loginSubtitle: {
        fontSize: 15,
        color: Colors.textLight,
        textAlign: 'center',
        marginBottom: 24,
    },
    pinInput: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.background,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    loginButton: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.white,
    },
    loginNote: {
        fontSize: 13,
        color: Colors.textLight,
        textAlign: 'center',
        lineHeight: 18,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    section: {
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 16,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 12,
    },
    input: {
        height: 48,
        backgroundColor: Colors.background,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: Colors.text,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    textArea: {
        height: 100,
        paddingTop: 12,
        textAlignVertical: 'top',
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    typeButtonText: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: Colors.textLight,
    },
    typeButtonTextActive: {
        color: Colors.white,
    },
    addButton: {
        height: 48,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.white,
    },
    uploadButton: {
        height: 48,
        backgroundColor: Colors.dove,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
    },
    uploadButtonText: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: Colors.primary,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
});
