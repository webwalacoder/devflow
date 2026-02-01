"use client";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState } from "react";
import toast from "react-hot-toast";

interface Params {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}

const SavedQuestion = ({ questionId, hasSavedQuestionPromise }: Params) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const { data } = use(hasSavedQuestionPromise);

  const { saved: hasSaved } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId)
      return toast.error(
        <div>
          <p className="font-semibold">
            You need to be logged in to save a question
          </p>
        </div>,
      );

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success) throw new Error(error?.message || "An error occurred");

      toast(
        <div>
          <p className="font-semibold">
            {`Question ${data?.saved ? "saved" : "unsaved"} successfully`}
          </p>
        </div>,
      );
    } catch (error) {
      toast.error(
        <div>
          <p className="font-semibold">Error</p>
          <p className="text-sm opacity-80">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
        </div>,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSave}
    />
  );
};
export default SavedQuestion;
