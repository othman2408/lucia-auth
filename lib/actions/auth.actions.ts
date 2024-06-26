"use server";

import { generateIdFromEntropySize } from "lucia";
import { hash } from "argon2";
import { z } from "zod";
import { lucia } from "@/lib/auth";
import { SingUpSchema } from "@/app/types/ZodSchemas";
import { userTable } from "@/lib/db/schema";
import { cookies } from "next/headers";
import db from "@/lib/db/dbConnection";

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
