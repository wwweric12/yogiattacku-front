export interface Spot {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
    description?: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    spots?: Spot[];
    createdAt: number;
}

export type ChatEventType = 'SPOTS' | 'DESCRIPTION' | 'DONE' | 'ERROR';

export interface ChatResponse {
    type: ChatEventType;
    spots: Spot[] | null;
    descriptionChunk: string | null;
}
