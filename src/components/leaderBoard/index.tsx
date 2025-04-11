"use client";

import { useUser } from "@/context/authContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { createContestant, getContestants, updateContestant } from "@/actions";
import { Plus } from "lucide-react";

import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

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

function Leaderboard({ title }: { title: string }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const [leaderboardData, setLeaderboardData] = useState<ContestantData[] | []>(
    []
  );
  const [issueData, setIssueData] = useState<Issue>({
    title: "",
    level: "Level",
    url: "",
    date: new Date(),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [contestant, setContestant] = useState<ContestantData>({
    name: "",
    score: 0,
    issuesFixed: [],
  });

  async function createContestantAction() {
    if (contestant.name.trim() === "") {
      alert("Please enter a name");
      return;
    }
    await createContestant(contestant, "/");
    const updatedData = await getContestants();
    setLeaderboardData(updatedData);
    setContestant({ name: "", score: 0, issuesFixed: [] });
    setIsOpen(false);
  }

  async function addIssueAction(index: number, id: string) {
    if (issueData.title.trim() === "") {
      alert("Please enter a title");
      return;
    }
    if (issueData.url.trim() === "") {
      alert("Please enter a url");
      return;
    }
    if (issueData.level === "Level") {
      alert("Please select a level");
      return;
    }
    const updatedContestant: ContestantData = {
      ...leaderboardData[index],
      issuesFixed: [
        ...leaderboardData[index].issuesFixed,
        {
          title: issueData.title,
          level: issueData.level,
          url: issueData.url,
          date: new Date(),
        },
      ],
    };
    if (issueData.level === "Raised") {
      updatedContestant.score = updatedContestant.score + 2;
    }
    if (issueData.level === "Hard") {
      updatedContestant.score = updatedContestant.score + 25;
    }
    if (issueData.level === "Medium") {
      updatedContestant.score = updatedContestant.score + 10;
    }
    if (issueData.level === "Easy") {
      updatedContestant.score = updatedContestant.score + 5;
    }
    if (id !== "") {
      const response = await updateContestant(updatedContestant, id);
      console.log(response);
      const updatedData = await getContestants();
      setLeaderboardData(updatedData);
    }
    setIssueData({ title: "", level: "Level", url: "", date: new Date() });
  }

  useEffect(() => {
    async function fetchLeaderboardData() {
      const response = await getContestants();
      console.log(response);
      if (response !== null) setLeaderboardData(response);
      setLoading(false);
    }

    fetchLeaderboardData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-70 md:w-110">
        <CardHeader>
          <CardTitle className="font-bold text-xl md:text-2xl text-center ">
            {title} Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center px-0 md:px-4">
          <div className="flex items-center justify-between w-full pb-2 border-b-2 border-gray-300 px-4">
            <h1 className="font-bold text-lg md:text-xl pl-5">Name</h1>
            <h1 className="font-bold text-lg md:text-xl text-center">Score</h1>
          </div>
          {leaderboardData && leaderboardData.length > 0 ? (
            leaderboardData.map((contestant, index) => (
              <div
                className="flex items-center justify-between w-full"
                key={index}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between w-full py-1 hover:bg-gray-100 cursor-pointer">
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
                {user && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"outline"} className="cursor-pointer">
                        <Plus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogTitle>New issue by {contestant.name}</DialogTitle>
                      <form
                        className="space-y-1 w-full"
                        action={() =>
                          addIssueAction(index, contestant._id || "")
                        }
                      >
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={issueData.title}
                            onChange={(e) => {
                              setIssueData({
                                ...issueData,
                                title: e.target.value,
                              });
                            }}
                            placeholder="Enter title of the issue"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="url" className="text-right">
                            Url
                          </Label>
                          <Input
                            id="url"
                            value={issueData.url}
                            onChange={(e) => {
                              setIssueData({
                                ...issueData,
                                url: e.target.value,
                              });
                            }}
                            placeholder="Enter title of the issue"
                            className="col-span-3"
                          />
                        </div>
                        <div className="flex items-center justify-between w-full p-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button>{issueData.level}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="cursor-pointer">
                              <DropdownMenuItem
                                onClick={() => {
                                  setIssueData({
                                    ...issueData,
                                    level: "Easy",
                                  });
                                }}
                              >
                                Easy
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setIssueData({
                                    ...issueData,
                                    level: "Medium",
                                  });
                                }}
                              >
                                Medium
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  setIssueData({
                                    ...issueData,
                                    level: "Hard",
                                  });
                                }}
                              >
                                Hard
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setIssueData({
                                    ...issueData,
                                    level: "Raised",
                                  });
                                }}
                              >
                                Raised
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button className="cursor-pointer">Add</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
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
        {user && (
          <CardFooter className="flex justify-center items-center">
            <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer">Add contestant</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Contestant</DialogTitle>
                </DialogHeader>
                <form action={createContestantAction}>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={contestant.name}
                      onChange={(e) =>
                        setContestant({ ...contestant, name: e.target.value })
                      }
                      placeholder="Enter name"
                      className="col-span-3"
                    />
                  </div>
                  <DialogFooter>
                    <Button className="cursor-pointer">Add</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default Leaderboard;
