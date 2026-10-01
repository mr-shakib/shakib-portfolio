import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

/**
 * Session token helpers. Edge-safe (no Node APIs) so middleware can check the
 * signature before a request ever reaches an admin page.
 */

export const SESSION_COOKIE = "sh_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  /** User id. */
  sub: string;
  /** User.sessionVersion at sign-in; a password change invalidates older tokens. */
  ver: number;
}

const encode = (secret: string) => new TextEncoder().encode(secret);

export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  return new SignJWT({ ver: payload.ver })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(encode(secret));
}

export async function verifySession(
  token: string | undefined,
  secret: string | undefined,
): Promise<SessionPayload | null> {
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, encode(secret), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.ver !== "number") return null;
    return { sub: payload.sub, ver: payload.ver };
  } catch {
    return null;
  }
}
