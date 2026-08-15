import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Secret for JWT
const secretKey = process.env.JWT_SECRET || "your-secret-key-change-this";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Set expiration time
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null; // Return null if verification fails
    }
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

/**
 * Refreshes the session cookie expiry without returning a response.
 * Applies the refreshed cookie onto the provided NextResponse so the
 * middleware can continue its own role/redirect logic before returning.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  if (!parsed) return; // expired / invalid — don't refresh

  // Refresh expiration on each request so the user stays logged in
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
  response.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: parsed.expires,
    path: "/",
  });
}
