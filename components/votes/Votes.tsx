"use client";

import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

interface Params {
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
}

const Votes = ({ upvotes, downvotes, hasupVoted, hasdownVoted }: Params) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast.error(
        <div>
          <p className="font-semibold">Please login to vote</p>
          <p className="text-sm opacity-80">Only logged-in users can vote</p>
        </div>,
      );
    }

    setIsLoading(true);

    try {
      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasupVoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasdownVoted ? "added" : "removed"} successfully`;

      toast(
        <div>
          <p className="font-semibold">{successMessage}</p>
          <p className="text-sm opacity-80">Your vote has been recorded.</p>
        </div>,
      );
    } catch {
      toast.error(
        <div>
          <p className="font-semibold">Failed to vote</p>
          <p className="text-sm opacity-80">
            An error occurred while voting. Please try again later.
          </p>
        </div>,
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={hasupVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={hasdownVoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Votes;
