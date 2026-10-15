// 회원 가입 / 로그인 / 세션 / 관리자 승인 처리입니다.
//
// 가입하면 'pending'(승인 대기) 상태로 저장되고, 관리자가 승인해야 로그인됩니다.
// 첫 관리자는 환경변수 ADMIN_EMAILS 로 지정합니다 (쉼표로 여러 명 가능).
// 예: ADMIN_EMAILS="bruno@example.com,zoey@example.com"
// 이 목록에 있는 이메일로 가입하면 자동으로 승인되고 관리자 권한을 갖습니다.

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getSql } from "./db";
import { ensureSchema } from "./schema";

export const SESSION_COOKIE = "remo_session";
const SESSION_DAYS = 30;

export type Role = "admin" | "member";
export type MemberStatus = "pending" | "approved" | "rejected";

export type User = {
  id: number;
  email: string;
  name: string;
  role: Role;
  status: MemberStatus;
  createdAt: string;
};

export const AUTH_LIMITS = {
  nameMax: 20,
  emailMax: 120,
  passwordMin: 8,
  passwordMax: 72,
} as const;

// ── 비밀번호 ───────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ── 관리자 지정 ────────────────────────────────────────────────────────

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return adminEmails().includes(email.trim().toLowerCase());
}

/** 관리자 이메일이 하나도 지정돼 있지 않으면 아무도 승인을 못 하므로 안내가 필요합니다. */
export function hasAdminConfigured(): boolean {
  return adminEmails().length > 0;
}

// ── 조회 ───────────────────────────────────────────────────────────────

function toUser(row: Record<string, unknown>): User {
  return {
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name),
    role: String(row.role) as Role,
    status: String(row.status) as MemberStatus,
    createdAt: new Date(row.created_at as string | Date).toISOString(),
  };
}

export type SignupResult = { ok: true; status: MemberStatus } | { ok: false; error: string };

export async function signup(input: {
  email: string;
  name: string;
  password: string;
}): Promise<SignupResult> {
  const sql = getSql();
  if (!sql) return { ok: false, error: "데이터베이스가 연결되어 있지 않습니다." };
  await ensureSchema(sql);

  const email = input.email.trim().toLowerCase();
  const existing = await sql.query(`SELECT id FROM users WHERE email = $1`, [email]);
  if (existing.length > 0) return { ok: false, error: "이미 가입된 이메일이에요." };

  const admin = isAdminEmail(email);
  await sql.query(
    `INSERT INTO users (email, name, password_hash, role, status)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      email,
      input.name.trim(),
      hashPassword(input.password),
      admin ? "admin" : "member",
      admin ? "approved" : "pending",
    ],
  );

  return { ok: true, status: admin ? "approved" : "pending" };
}

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "pending" | "rejected" | "no-db" };

export async function login(email: string, password: string): Promise<LoginResult> {
  const sql = getSql();
  if (!sql) return { ok: false, reason: "no-db" };
  await ensureSchema(sql);

  const rows = await sql.query(
    `SELECT id, email, name, role, status, password_hash, created_at
     FROM users WHERE email = $1`,
    [email.trim().toLowerCase()],
  );
  if (rows.length === 0) return { ok: false, reason: "invalid" };

  const row = rows[0];
  if (!verifyPassword(password, String(row.password_hash))) {
    return { ok: false, reason: "invalid" };
  }

  const status = String(row.status) as MemberStatus;
  if (status === "pending") return { ok: false, reason: "pending" };
  if (status === "rejected") return { ok: false, reason: "rejected" };

  await createSession(Number(row.id));
  return { ok: true };
}

// ── 세션 ───────────────────────────────────────────────────────────────

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function createSession(userId: number): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("no db");

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await sql.query(
    `INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)`,
    [hashToken(token), userId, expires.toISOString()],
  );

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function logout(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const sql = getSql();
    if (sql) {
      await ensureSchema(sql);
      await sql.query(`DELETE FROM sessions WHERE token_hash = $1`, [hashToken(token)]);
    }
  }
  store.delete(SESSION_COOKIE);
}

/** 지금 로그인한 사용자. 비로그인·만료·승인 취소된 경우 null */
export async function currentUser(): Promise<User | null> {
  // cookies()를 먼저 읽습니다. 그래야 이 함수를 쓰는 페이지(헤더 포함)가
  // 빌드 시점에 정적으로 굳지 않고, 요청마다 로그인 상태를 반영합니다.
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const sql = getSql();
  if (!sql) return null;

  await ensureSchema(sql);
  const rows = await sql.query(
    `SELECT u.id, u.email, u.name, u.role, u.status, u.created_at
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hashToken(token)],
  );
  if (rows.length === 0) return null;

  const user = toUser(rows[0]);
  // 승인이 취소된 계정은 남아 있는 세션으로도 들어올 수 없게 합니다.
  if (user.status !== "approved") return null;
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  return user?.role === "admin";
}

// ── 관리자: 회원 관리 ──────────────────────────────────────────────────

export async function listUsers(): Promise<User[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema(sql);
  const rows = await sql.query(
    `SELECT id, email, name, role, status, created_at
     FROM users
     ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, id DESC`,
  );
  return rows.map(toUser);
}

export async function setUserStatus(userId: number, status: MemberStatus): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("데이터베이스가 연결되어 있지 않습니다.");
  await ensureSchema(sql);
  await sql.query(`UPDATE users SET status = $1 WHERE id = $2`, [status, userId]);
  // 승인이 아닌 상태가 되면 기존 로그인 세션도 정리합니다.
  if (status !== "approved") {
    await sql.query(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
  }
}
