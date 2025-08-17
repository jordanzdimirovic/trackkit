import { User } from "@prisma/client";

export type SessionUserPayload = Omit<User, "passwordHash" | "providerId">