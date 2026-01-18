import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Article, GalleryItem, Quote, AboutContent } from '@/types/content';

const STORAGE_KEYS = {
    ARTICLES: 'fafa_articles',
    GALLERY: 'fafa_gallery',
    QUOTES: 'fafa_quotes',
    ABOUT: 'fafa_about',
    ADMIN_PIN: 'fafa_admin_pin',
};

const DEFAULT_ABOUT: AboutContent = {
    mission: 'FAFA - Graines de Paix œuvre pour un avenir meilleur en semant les graines de la paix, de l\'espoir et du développement durable dans nos communautés.',
    vision: 'Construire une société où chaque individu peut s\'épanouir dans un environnement de paix et d\'harmonie.',
    description: 'Notre association travaille sur le terrain pour promouvoir l\'éducation, l\'environnement et la cohésion sociale.',
};

const DEFAULT_ARTICLES: Article[] = [
    {
        id: '1',
        title: 'Plantation d\'arbres - Mars 2024',
        content: 'Notre équipe a planté 200 arbres dans la région. Un grand succès grâce à la mobilisation de tous nos bénévoles!',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        type: 'action',
        author: 'FAFA Team',
        createdAt: Date.now() - 86400000 * 5,
    },
    {
        id: '2',
        title: 'Journée de sensibilisation',
        content: 'Grande journée de sensibilisation à l\'environnement organisée avec les écoles locales.',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        type: 'news',
        author: 'FAFA Team',
        createdAt: Date.now() - 86400000 * 2,
    },
];

export const [ContentProvider, useContent] = createContextHook(() => {
    const queryClient = useQueryClient();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const articlesQuery = useQuery({
        queryKey: ['articles'],
        queryFn: async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEYS.ARTICLES);
            return stored ? JSON.parse(stored) : DEFAULT_ARTICLES;
        },
    });

    const galleryQuery = useQuery({
        queryKey: ['gallery'],
        queryFn: async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEYS.GALLERY);
            return stored ? JSON.parse(stored) : [];
        },
    });

    const quotesQuery = useQuery({
        queryKey: ['quotes'],
        queryFn: async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEYS.QUOTES);
            return stored ? JSON.parse(stored) : [];
        },
    });

    const aboutQuery = useQuery({
        queryKey: ['about'],
        queryFn: async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEYS.ABOUT);
            return stored ? JSON.parse(stored) : DEFAULT_ABOUT;
        },
    });

    const addArticleMutation = useMutation({
        mutationFn: async (article: Article) => {
            const current = articlesQuery.data || [];
            const updated = [article, ...current];
            await AsyncStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
            return updated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
    });

    const deleteArticleMutation = useMutation({
        mutationFn: async (id: string) => {
            const current = articlesQuery.data || [];
            const updated = current.filter((a: Article) => a.id !== id);
            await AsyncStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
            return updated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
    });

    const addGalleryItemMutation = useMutation({
        mutationFn: async (item: GalleryItem) => {
            const current = galleryQuery.data || [];
            const updated = [item, ...current];
            await AsyncStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));
            return updated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery'] });
        },
    });

    const deleteGalleryItemMutation = useMutation({
        mutationFn: async (id: string) => {
            const current = galleryQuery.data || [];
            const updated = current.filter((item: GalleryItem) => item.id !== id);
            await AsyncStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));
            return updated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery'] });
        },
    });

    const addQuoteMutation = useMutation({
        mutationFn: async (quote: Quote) => {
            const current = quotesQuery.data || [];
            const updated = [quote, ...current];
            await AsyncStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(updated));
            return updated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotes'] });
        },
    });

    const updateAboutMutation = useMutation({
        mutationFn: async (about: AboutContent) => {
            await AsyncStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(about));
            return about;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['about'] });
        },
    });

    const verifyAdminMutation = useMutation({
        mutationFn: async (pin: string) => {
            const storedPin = await AsyncStorage.getItem(STORAGE_KEYS.ADMIN_PIN);
            if (!storedPin) {
                await AsyncStorage.setItem(STORAGE_KEYS.ADMIN_PIN, '19470');
                return pin === '19470';
            }
            return pin === storedPin;
        },
        onSuccess: (isValid) => {
            setIsAdmin(isValid);
        },
    });

    const updatePinMutation = useMutation({
        mutationFn: async (newPin: string) => {
            await AsyncStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
            return true;
        },
    });

    return {
        articles: articlesQuery.data || [],
        gallery: galleryQuery.data || [],
        quotes: quotesQuery.data || [],
        about: aboutQuery.data || DEFAULT_ABOUT,
        isLoading: articlesQuery.isLoading || galleryQuery.isLoading || quotesQuery.isLoading || aboutQuery.isLoading,
        isAdmin,
        setIsAdmin,
        addArticle: addArticleMutation.mutateAsync,
        deleteArticle: deleteArticleMutation.mutateAsync,
        addGalleryItem: addGalleryItemMutation.mutateAsync,
        deleteGalleryItem: deleteGalleryItemMutation.mutateAsync,
        addQuote: addQuoteMutation.mutateAsync,
        updateAbout: updateAboutMutation.mutateAsync,
        verifyAdmin: verifyAdminMutation.mutateAsync,
        updatePin: updatePinMutation.mutateAsync,
    };
});
