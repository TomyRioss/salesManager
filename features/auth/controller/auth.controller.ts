'use server'

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { loginSchema, registerSchema } from '../model/schema'
import type { AuthResult, SessionUser } from '../model/types'

const REGISTER_CODE = 'TOMY2026'
const SESSION_COOKIE = 'session'

export async function register(formData: FormData): Promise<AuthResult> {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
    surname: formData.get('surname') as string,
    code: formData.get('code') as string,
  }

  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  if (data.code !== REGISTER_CODE) {
    return { success: false, error: 'Código de registro inválido' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    return { success: false, error: 'El email ya está registrado' }
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      surname: data.surname,
    },
  })

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, JSON.stringify(sessionUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  return { success: true, user: sessionUser }
}

export async function login(formData: FormData): Promise<AuthResult> {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (!user) {
    return { success: false, error: 'Credenciales inválidas' }
  }

  const validPassword = await bcrypt.compare(data.password, user.passwordHash)
  if (!validPassword) {
    return { success: false, error: 'Credenciales inválidas' }
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, JSON.stringify(sessionUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { success: true, user: sessionUser }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)

  if (!session?.value) {
    return null
  }

  try {
    return JSON.parse(session.value) as SessionUser
  } catch {
    return null
  }
}
