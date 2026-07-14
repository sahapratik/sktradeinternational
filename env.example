import { argon2id, argon2Verify } from 'hash-wasm';
import { randomBytes } from 'crypto';

// Argon2id password hashing, isolated from session.ts on purpose — see the
// comment there. This file is only ever imported from Node-runtime API
// routes and the seed script, never from middleware.ts.

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  return argon2id({
    password,
    salt,
    parallelism: 1,
    iterations: 3,
    memorySize: 19456, // ~19MB, OWASP-recommended baseline for Argon2id
    hashLength: 32,
    outputType: 'encoded',
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2Verify({ password, hash });
  } catch {
    return false;
  }
}
