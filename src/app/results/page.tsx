"use client";

import { getContestants } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface Issue {
  title: string;
  level: string;
  url: string;
  date: Date;
}

interface ContestantData {
  _id?: string;
  name: string;
  score: number;
  issuesFixed: Issue[];
}

function Results() {
  const targetDate = new Date("2025-04-11T23:59:59"); // EOD 12 April 2025

  const [timeLeft, setTimeLeft] = useState(targetDate.getTime() - Date.now());
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLoading, setTimeLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<ContestantData[] | []>(
    []
  );

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      setTimeLoading(false);
      return;
    }
    setTimeLoading(false);
    const interval = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        setIsTimeUp(true);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    async function fetchLeaderboardData() {
      const response = await getContestants();
      if (response !== null) setLeaderboardData(response);
      setLoading(false);
    }

    fetchLeaderboardData();
  }, []);

  if (!isTimeUp)
    return (
      <div className="flex flex-col items-center justify-center w-full h-[25rem] md:h-[40rem] px-4 md:px-0 py-10">
        {timeLoading ? (
          <Skeleton className="h-110 w-100" />
        ) : (
          <h1 className="text-xl md:text-4xl mb-2 md:mb-4 font-bold">
            Time left: {formatTime(timeLeft)}
          </h1>
        )}
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center w-fullh-screen px-4 md:px-0 py-10">
      <h1 className="text-2xl md:text-4xl mb-2 md:mb-4 font-bold">
        Congratulations!! 🎉
      </h1>
      <Card className="w-70 md:w-110">
        <CardHeader>
          <CardTitle className="font-bold text-xl md:text-2xl text-center ">
            Open Source Marathon
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center px-0 md:px-4">
          <div className="flex items-center justify-between w-full pb-2 border-b-2 border-gray-300 px-4">
            <h1 className="font-bold text-lg md:text-xl pl-5">Name</h1>
            <h1 className="font-bold text-lg md:text-xl text-center">Score</h1>
          </div>
          {leaderboardData && leaderboardData.length > 0 ? (
            leaderboardData
              .filter((person) => person.score > 0)
              .slice(0, 10)
              .map((contestant, index) => (
                <div
                  className="flex items-center justify-between w-full"
                  key={index}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        className={`flex items-center justify-between w-full py-1  cursor-pointer ${
                          index == 0
                            ? "bg-yellow-300"
                            : index == 1
                            ? "bg-gray-300"
                            : index == 2
                            ? "bg-[#ec9f52]"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-start w-full">
                          <span className={`w-6 text-center font-semibold`}>
                            {index + 1}
                          </span>
                          <h1 className="font-semibold text-md md:text-lg  px-4">
                            {contestant.name}
                          </h1>
                        </div>
                        <h1 className="font-semibold text-md md:text-lg text-center px-4 w-20 ">
                          {contestant.score}
                        </h1>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] sm:max-h-[500px]">
                      <DialogHeader>
                        <DialogTitle>
                          Issues Fixed by {contestant.name}
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-72 w-full rounded-md ">
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          {contestant.issuesFixed.length > 0 ? (
                            contestant.issuesFixed.map((issue, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between w-full py-1 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  window.open(
                                    issue.url,
                                    "_blank",
                                    "noopener,noreferrer"
                                  )
                                }
                              >
                                <div className="flex items-center justify-start w-full">
                                  <span
                                    className={`w-6 text-center font-semibold`}
                                  >
                                    {index + 1}
                                  </span>
                                  <h1 className="font-semibold text-md md:text-lg  px-4">
                                    {issue.title}
                                  </h1>
                                </div>
                                <Button
                                  variant={"outline"}
                                  className={`w-20 mr-3 ${
                                    issue.level === "Raised" ||
                                    issue.level === "Easy"
                                      ? "bg-green-100 border-2 border-green-300"
                                      : issue.level === "Medium"
                                      ? "bg-yellow-100 border-2 border-yellow-300"
                                      : "bg-red-100 border-2 border-red-300"
                                  }`}
                                >
                                  {issue.level}
                                </Button>
                              </div>
                            ))
                          ) : (
                            <h1 className="font-semibold text-md md:text-lg px-4">
                              No issues fixed yet
                            </h1>
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              ))
          ) : loading ? (
            <div className="grid grid-cols-3 w-full pt-1">
              <h1 className="font-semibold text-md md:text-lg col-span-3 px-4 text-center">
                Loading...
              </h1>
            </div>
          ) : (
            <div className="grid grid-cols-3 w-full pt-1">
              <h1 className="font-semibold text-md md:text-lg col-span-3 px-4">
                No Contestants Found
              </h1>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Results;
