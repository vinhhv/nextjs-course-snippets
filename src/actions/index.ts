"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  try {
    // Check the user's input and validate it
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !== "string" || title.length < 3) {
      return {
        message: "Title must be longer",
      };
    }

    if (typeof code !== "string" || code.length < 10) {
      return {
        message: "Code must be longer",
      };
    }

    // Create a new record in the database
    await db.snippet.create({
      data: {
        title,
        code,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      message: error.message;
    } else {
      return {
        message: "Something went wrong...",
      };
    }
  }
  revalidatePath("/");
  // Redirect the user back to the root route
  redirect("/");
}

export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });

  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({
    where: { id },
  });

  revalidatePath("/");
  redirect("/");
}
