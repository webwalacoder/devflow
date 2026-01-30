"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AnswerSchema } from "@/lib/validations";
import { useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { toSafeMDX } from "@/lib/utils";

const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

interface Props {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId: questionId,
        content: values.content,
      });

      if (result.success) {
        form.reset();

        toast.success(
          <div>
            <p className="font-semibold">Success</p>
            <p className="text-sm opacity-80">
              Your answer has been posted successfully
            </p>
          </div>,
        );

        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast.error(
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm opacity-80">{result.error?.message}</p>
          </div>,
        );
      }
    });
  };

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast(
        <div>
          <p className="font-semibold">Please log in</p>
          <p className="text-sm opacity-80">
            You need to be logged to use this feature
          </p>
        </div>,
      );
    }

    setIsAISubmitting(true);

    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer,
      );

      if (!success) {
        return toast.error(
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm opacity-80">{error?.message}</p>
          </div>,
        );
      }

      const safeMarkdown = toSafeMDX(data!);

      if (editorRef.current) {
        editorRef.current.setMarkdown(safeMarkdown);

        form.setValue("content", safeMarkdown);
        form.trigger("content");
      }

      toast.success(
        <div>
          <p className="font-semibold">Success</p>
          <p className="text-sm opacity-80">AI Answer has been generated</p>
        </div>,
      );
    } catch (error) {
      toast.error(
        <div>
          <p className="font-semibold">Error</p>
          <p className="text-sm opacity-80">
            {error instanceof Error
              ? error.message
              : "There was a problem with your request"}
          </p>
        </div>,
      );
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <div className="mt-3.5">
                  <FormControl>
                    <Editor
                      value={field.value}
                      ref={editorRef}
                      fieldChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="primary-gradient w-fit">
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
