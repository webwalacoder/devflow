import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    description: "I want to learn React, can anyone help me?",
    tags: [
      {
        _id: "1",
        name: "React",
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image:
        "data:image/jpeg;base64,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",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to learn JavaScript?",
    description: "I want to learn Javascript, can anyone help me?",
    tags: [
      {
        _id: "2",
        name: "JavaScript",
      },
    ],
    author: {
      _id: "1",
      name: "Bob De",
      image:
        "data:image/jpeg;base64,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",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query?.toLowerCase());
    const matchesFilter = filter
      ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
      : true;

    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 text-light-900!"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};
export default Home;
