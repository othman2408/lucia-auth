"use server";

import { generateIdFromEntropySize } from "lucia";
import { hash, verify } from "argon2";
import { z } from "zod";
import { lucia, validateRequest } from "@/lib/auth";
import { SingUpSchema, SingInSchema } from "@/app/types/ZodSchemas";
import { userTable } from "@/lib/db/schema";
import { cookies } from "next/headers";
import db from "@/lib/db/dbConnection";
import { eq } from "drizzle-orm";

export const signUp = async (values: z.infer<typeof SingUpSchema>) => {
  //   console.log(values);

  // Hash the password & generate a unique id for the user
  const hashedPassword = await hash(values.password, {
    memoryCost: 19456,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
  });
  const userId = generateIdFromEntropySize(10);

  try {
    // Insert the user into the database
    await db
      .insert(userTable)
      .values({
        id: userId,
        username: values.username,
        hashedPassword,
      })
      .returning({
        id: userTable.id,
        username: userTable.username,
      });

    // Generate a session token for the user
    const session = await lucia.createSession(userId, {
      expiresIn: 60 * 60 * 24, // 24 hours
    });

    // Create a session cookie
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Set the session cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // Return the userId
    return {
      success: true,
      data: {
        userId,
      },
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const signIn = async (values: z.infer<typeof SingInSchema>) => {
  // Find the user in the database
  const user = await db.query.userTable.findFirst({
    where: (table) => eq(table.username, values.username),
  });

  // Check if the user exists and the password is correct
  if (!user || !user.hashedPassword) {
    return {
      error: "User not found or password is incorrect.",
    };
  }

  // Verify the password
  const validPassword = await verify(user.hashedPassword, values.password);

  // If the password is not valid, return an error message
  if (!validPassword) {
    return {
      error: "User not found or password is incorrect.",
    };
  }

  // Generate a session token for the user
  const session = await lucia.createSession(user.id, {
    expiresIn: 60 * 60 * 24, // 24 hours
  });

  // Create a session cookie
  const sessionCookie = lucia.createSessionCookie(session.id);

  // Set the session cookie
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    success: true,
  };
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
