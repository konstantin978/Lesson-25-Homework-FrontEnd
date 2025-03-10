import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import Database from "better-sqlite3";
import { Lucia, TimeSpan } from "lucia";
import { cookies } from "next/headers";

const db = new Database('auth.db');

const adapter = new BetterSqlite3Adapter(db, {
    user: 'users',
    session: 'session'
});

export const lucia = new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(2, 'm'),
    sessionCookie: {
        expires: false,
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production"
        }
    }
});

export const createAuthSession = async (user: string) => {
    const session = await lucia.createSession(user, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
};

export const verifyAuth = async () => {
    const sessionCookie = cookies().get(lucia.sessionCookieName);
    if (!sessionCookie || !sessionCookie.value) {
        return {
            user: null,
            session: null
        };
    };

    const sessionId = sessionCookie.value;
    const result = await lucia.validateSession(sessionId);

    try {
        if (result.session) {
            const sessionCookie = lucia.createSessionCookie(result.session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        } else {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        };
    } catch { };

    return result;
};

export const deleteToken = async () => {
    const result = await verifyAuth();
    if (result.session) {
        await lucia.invalidateSession(result.session.id);
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
    };
};