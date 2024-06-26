"use server";

import { SingUpSchema } from "@/app/types/ZodSchemas";
import { z } from "zod";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import db from "@/lib/db/dbConnection";
import { userTable } from "../db/schema";
import { lucia } from "../auth";
import { cookies } from "next/headers";

export const signUp = async (values: z.infer<typeof SingUpSchema>) => {
  //   console.log(values);

  // Hash the password & generate a unique id for the user
  const hashedPassword = await new Argon2id().hash(values.password);
  const userId = generateId(15);

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
      expiresIn: "1d",
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
