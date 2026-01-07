"use server";

import { ZodError, ZodType } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { parseZodErrors } from "../utils";
import { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodType<T>;
  authorize?: boolean;
};

// 1. Checking whether the schema and params are provided and validated.
// 2. Checking whether the user is authorized.
// 3. Connecting to the database.
// 4. Returning the params and session.

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  // 1.
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = parseZodErrors(error);
        return new ValidationError(fieldErrors as Record<string, string[]>);
      } else {
        return new Error("Schema validation failed");
      }
    }
  }

  // 2.
  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }

  // 3.
  await dbConnect();

  // 4.
  return { params, session };
}

export default action;
