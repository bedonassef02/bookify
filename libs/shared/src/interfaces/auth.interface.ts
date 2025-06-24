import { UserDocument } from '../../../../apps/user-service/src/entities/user.entity';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Partial<UserDocument>;
  tokens: AuthTokens;
}
