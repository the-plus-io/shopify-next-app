import { Session as ShopifySession } from "@shopify/shopify-api";
import { db } from "./index";
import { sessions, onlineAccessInfo, associatedUser } from "./schema";
import { eq, and, inArray } from 'drizzle-orm';

const apiKey = process.env.SHOPIFY_API_KEY || "";

export async function storeSession(session: ShopifySession) {
  await db.insert(sessions).values({
    id: session.id,
    shop: session.shop,
    accessToken: session.accessToken,
    scope: session.scope,
    expires: session.expires ? new Date(session.expires) : null,
    isOnline: session.isOnline,
    state: session.state,
    apiKey,
  }).onConflictDoUpdate({
    target: sessions.id,
    set: {
      shop: session.shop,
      accessToken: session.accessToken,
      scope: session.scope,
      expires: session.expires ? new Date(session.expires) : null,
      isOnline: session.isOnline,
      state: session.state,
      apiKey,
    },
  });

  if (session.onlineAccessInfo) {
    const [onlineAccessInfoRecord] = await db.insert(onlineAccessInfo).values({
      sessionId: session.id,
      expiresIn: session.onlineAccessInfo.expires_in,
      associatedUserScope: session.onlineAccessInfo.associated_user_scope,
    }).onConflictDoUpdate({
      target: onlineAccessInfo.sessionId,
      set: {
        expiresIn: session.onlineAccessInfo.expires_in,
        associatedUserScope: session.onlineAccessInfo.associated_user_scope,
      },
    }).returning();

    const { associated_user } = session.onlineAccessInfo;
    await db.insert(associatedUser).values({
      onlineAccessInfoId: onlineAccessInfoRecord.id,
      firstName: associated_user.first_name,
      lastName: associated_user.last_name,
      email: associated_user.email,
      emailVerified: associated_user.email_verified,
      accountOwner: associated_user.account_owner,
      locale: associated_user.locale,
      collaborator: associated_user.collaborator,
      userId: associated_user.id,
    }).onConflictDoUpdate({
      target: associatedUser.onlineAccessInfoId,
      set: {
        firstName: associated_user.first_name,
        lastName: associated_user.last_name,
        email: associated_user.email,
        emailVerified: associated_user.email_verified,
        accountOwner: associated_user.account_owner,
        locale: associated_user.locale,
        collaborator: associated_user.collaborator,
        userId: associated_user.id,
      },
    });
  }
}

export async function loadSession(id: string) {
  const [session] = await db.select().from(sessions).where(eq(sessions.id, id));

  if (session) {
    return generateShopifySessionFromDB(session);
  } else {
    throw new SessionNotFoundError();
  }
}

export async function deleteSession(id: string) {
  await db.delete(sessions).where(eq(sessions.id, id));
}

export async function deleteSessions(ids: string[]) {
  await db.delete(sessions).where(inArray(sessions.id, ids));
}

export async function cleanUpSession(shop: string, accessToken: string) {
  await db.delete(sessions).where(
    and(
      eq(sessions.shop, shop),
      eq(sessions.accessToken, accessToken),
      eq(sessions.apiKey, apiKey)
    )
  );
}

export async function findSessionsByShop(shop: string) {
  const sessionsData = await db.select().from(sessions)
    .where(
      and(
        eq(sessions.shop, shop),
        eq(sessions.apiKey, apiKey)
      )
    );

  return sessionsData.map((session) => generateShopifySessionFromDB(session));
}

function generateShopifySessionFromDB(session: typeof sessions.$inferSelect) {
  return new ShopifySession({
    id: session.id,
    shop: session.shop,
    accessToken: session.accessToken || undefined,
    scope: session.scope || undefined,
    state: session.state,
    isOnline: session.isOnline,
    expires: session.expires || undefined,
  });
}

export class SessionNotFoundError extends Error {
  constructor() {
    super("Session not found");
    this.name = "SessionNotFoundError";
  }
}
