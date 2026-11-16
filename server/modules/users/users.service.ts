import { eq } from 'drizzle-orm';
import { db } from '../../../src/db/index.ts';
import { users } from '../../../src/db/schema.ts';
import { getAppConfig } from '../config/env.ts';

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string | null,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const config = getAppConfig();
  const isAllowlistedAdmin = config.adminEmails.includes(normalizedEmail);

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.uid, uid))
      .limit(1);

    const resolvedRole = existing[0]
      ? existing[0].role === 'ADMIN' || isAllowlistedAdmin
        ? 'ADMIN'
        : existing[0].role
      : isAllowlistedAdmin
        ? 'ADMIN'
        : 'STAFF';

    const result = await db
      .insert(users)
      .values({
        uid,
        email: normalizedEmail,
        displayName: displayName || null,
        role: resolvedRole,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: normalizedEmail,
          displayName: displayName || null,
          role: resolvedRole,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database error synchronizing user:', error);
    throw new Error('Unable to verify user profile.', { cause: error });
  }
}
