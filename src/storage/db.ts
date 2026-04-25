import Dexie, { type Table } from 'dexie'

/**
 * INTERFACE DEFINITIONS
 * These define the structure of data saved in our local database (IndexedDB).
 */

// Represents a form-filling session
export interface Session {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  status: 'active' | 'completed' | 'archived'
}

// Represents an image captured/uploaded (stored as a Blob)
export interface FormImage {
  id?: number
  sessionId: string
  blob: Blob
  timestamp: number
}

// Represents a single message in the chat history
export interface ChatMessage {
  id?: number
  sessionId: string
  text: string
  sender: 'user' | 'ai'
  timestamp: number
}

/**
 * DATABASE CLASS
 * Uses Dexie.js to manage IndexedDB (the local browser database).
 */
export class AppDatabase extends Dexie {
  sessions!: Table<Session>
  images!: Table<FormImage>
  chats!: Table<ChatMessage>

  constructor() {
    super('GovFormDB')
    
    // Schema definition: defines which fields are searchable (indexed)
    this.version(1).stores({
      sessions: 'id, updatedAt',
      images: '++id, sessionId',
      chats: '++id, sessionId, timestamp'
    })
  }
}

// Create a single instance of the database to be used everywhere
export const db = new AppDatabase()
