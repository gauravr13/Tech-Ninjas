import Dexie, { type Table } from 'dexie';

export interface Session {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'completed' | 'error';
  thumbnail?: Blob;
}

export interface FormImage {
  id?: number;
  sessionId: string;
  blob: Blob;
  timestamp: number;
}

export interface ChatMessage {
  id?: number;
  sessionId: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export class AppDatabase extends Dexie {
  sessions!: Table<Session>;
  images!: Table<FormImage>;
  chats!: Table<ChatMessage>;

  constructor() {
    super('GovFormDB');
    this.version(1).stores({
      sessions: 'id, createdAt, updatedAt',
      images: '++id, sessionId, timestamp',
      chats: '++id, sessionId, timestamp'
    });
  }
}

export const db = new AppDatabase();
