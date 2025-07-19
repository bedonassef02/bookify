export class Redactor {
  private static readonly SENSITIVE_KEYS = [
    'email',
    'token',
    'tokens',
    'password',
    'accessToken',
    'refreshToken',
    'authorization',
  ];

  static sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const clone = Array.isArray(obj) ? [...obj] : { ...obj };
    for (const key in clone) {
      if (this.SENSITIVE_KEYS.includes(key.toLowerCase())) {
        clone[key] = '[REDACTED]';
      } else if (typeof clone[key] === 'object') {
        clone[key] = this.sanitize(clone[key]); // Recursive
      }
    }

    return clone;
  }
}
