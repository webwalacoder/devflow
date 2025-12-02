import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-errors";
import { ZodError } from "zod";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors
    );
  }

  if (error instanceof ZodError) {
    const formatted = error.format();

    const fieldErrors: Record<string, string[]> = {};

    for (const [field, value] of Object.entries(formatted)) {
      if (field === "_errors") continue;
      fieldErrors[field] = value._errors ?? [];
    }

    const validationError = new ValidationError(fieldErrors);

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    );
  }

  if (error instanceof Error) {
    return formatResponse(responseType, 500, error.message);
  }

  return formatResponse(responseType, 500, "An unexpected error occurred");
};

export default handleError;
