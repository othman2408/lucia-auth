"use server";

import { SingUpSchema } from "@/app/types/ZodSchemas";
import { z } from "zod";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "@/lib/auth";
import db from "@/lib/db/dbConnection";
import { userTable } from "@/lib/db/schema";
import { cookies } from "next/headers";

export const signUp = async (values: z.infer<typeof SingUpSchema>) => {
  //   console.log(values);

  // Hash the password & generate a unique id for the user
  const hashedPassword = 1;
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
