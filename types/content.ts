export interface Article {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    author: string;
    createdAt: number;
    type: 'news' | 'action';
}

export interface GalleryItem {
    id: string;
    imageUrl: string;
    caption: string;
    createdAt: number;
}

export interface Quote {
    id: string;
    text: string;
    author: string;
    createdAt: number;
}

export interface AboutContent {
    mission: string;
    vision: string;
    description: string;
}
