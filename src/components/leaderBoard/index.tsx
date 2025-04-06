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
import { createContestant, getContestants } from "@/actions";
import { Plus } from "lucide-react";

interface ContestantData {
  id: string;
  name: string;
  score: number;
  issuesFixed: {
    title: string;
    level: string;
    url: string;
    date: Date;
  }[];
}

function Leaderboard({ title }: { title: string }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const [leaderboardData, setLeaderboardData] = useState<ContestantData[] | []>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [contestant, setContestant] = useState({
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
    setContestant({ name: "", score: 0, issuesFixed: [] });
    setIsOpen(false);
  }

  useEffect(() => {
    async function fetchLeaderboardData() {
      const response = await getContestants();
      if (response !== null) setLeaderboardData(response);
      console.log(response);
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
                {user && (
                  <Button variant={"outline"} className="cursor-pointer">
                    <Plus />
                  </Button>
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
