"use client";

import { incrementViews } from "@/lib/actions/question.action";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Views = ({ questionId }: { questionId: string }) => {
  const handleIncrement = async () => {
    const result = await incrementViews({ questionId });

    if (result.success) {
      toast.success("Views Incremented");
    } else {
      toast.error(result.error?.message || "Failed to increment views");
    }
  };

  useEffect(() => {
    handleIncrement();
  }, []);

  return null;
};
export default Views;
