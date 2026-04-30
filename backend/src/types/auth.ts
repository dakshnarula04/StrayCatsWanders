export interface AdminRow {
  id: string;
  username: string;
  password_hash: string;
  name: string;
  created_at: Date;
  last_login: Date | null;
}

export interface TokenPayload {
  adminId: string;
  username: string;
  type: 'access' | 'refresh';
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AuthResponse {
  admin: {
    id: string;
    username: string;
    name: string;
  };
  accessToken: string;
}

// Extend Express Request to carry the verified admin
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        username: string;
      };
    }
  }
}
