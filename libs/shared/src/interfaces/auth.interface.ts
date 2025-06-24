import { Document } from 'mongoose';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Partial<Document>;
  tokens: AuthTokens;
}
