import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface SavedIdea {
  id: string;
  userId: string;
  ideaName: string;
  industry: string;
  geography: string;
  description: string;
  fundingStage: string;
  targetBudget: string;
  report: any;
  createdAt: string;
  currencySymbol?: string;
  currencyCode?: string;
}

export interface Suggestion {
  id: string;
  email: string;
  text: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  ideaName: string;
  ratingAccuracy: number;
  ratingUsefulness: number;
  comment: string;
  createdAt: string;
}

interface DBState {
  users: User[];
  savedIdeas: SavedIdea[];
  suggestions: Suggestion[];
  feedbacks: Feedback[];
}

function initDB(): DBState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const defaultState: DBState = {
        users: [],
        savedIdeas: [],
        suggestions: [],
        feedbacks: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), "utf-8");
      return defaultState;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error initializing database, using in-memory state:", err);
    return {
      users: [],
      savedIdeas: [],
      suggestions: [],
      feedbacks: [],
    };
  }
}

let dbState: DBState = initDB();

function saveDB() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database to file:", err);
  }
}

// Password utility functions
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// DB Operations
export const db = {
  // USER OPERATIONS
  createUser(email: string, passwordPlain: string): User {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = dbState.users.find(u => u.email === normalizedEmail);
    if (existing) {
      throw new Error("User with this email already exists.");
    }
    const salt = generateSalt();
    const passwordHash = hashPassword(passwordPlain, salt);
    const newUser: User = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    };
    dbState.users.push(newUser);
    saveDB();
    return newUser;
  },

  getUserByEmail(email: string): User | undefined {
    const normalizedEmail = email.toLowerCase().trim();
    return dbState.users.find(u => u.email === normalizedEmail);
  },

  getUserById(id: string): User | undefined {
    return dbState.users.find(u => u.id === id);
  },

  // SAVED IDEAS OPERATIONS
  saveIdea(userId: string, idea: Omit<SavedIdea, "id" | "userId" | "createdAt">): SavedIdea {
    const newIdea: SavedIdea = {
      id: crypto.randomUUID(),
      userId,
      ...idea,
      createdAt: new Date().toISOString(),
    };
    dbState.savedIdeas.push(newIdea);
    saveDB();
    return newIdea;
  },

  getSavedIdeas(userId: string): SavedIdea[] {
    return dbState.savedIdeas
      .filter(idea => idea.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  deleteSavedIdea(userId: string, ideaId: string): boolean {
    const initialLength = dbState.savedIdeas.length;
    dbState.savedIdeas = dbState.savedIdeas.filter(idea => !(idea.id === ideaId && idea.userId === userId));
    if (dbState.savedIdeas.length !== initialLength) {
      saveDB();
      return true;
    }
    return false;
  },

  // SUGGESTIONS OPERATIONS
  addSuggestion(email: string, text: string): Suggestion {
    const newSuggestion: Suggestion = {
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim() || "anonymous",
      text,
      createdAt: new Date().toISOString(),
    };
    dbState.suggestions.push(newSuggestion);
    saveDB();
    return newSuggestion;
  },

  getSuggestions(): Suggestion[] {
    return [...dbState.suggestions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // FEEDBACK OPERATIONS
  addFeedback(ideaName: string, ratingAccuracy: number, ratingUsefulness: number, comment: string): Feedback {
    const newFeedback: Feedback = {
      id: crypto.randomUUID(),
      ideaName,
      ratingAccuracy,
      ratingUsefulness,
      comment,
      createdAt: new Date().toISOString(),
    };
    dbState.feedbacks.push(newFeedback);
    saveDB();
    return newFeedback;
  },

  getFeedbacks(): Feedback[] {
    return [...dbState.feedbacks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};
