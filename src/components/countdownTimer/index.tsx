"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";

function CountdownTimer() {
  const targetDate = new Date("2025-04-11T23:59:59"); // EOD 12 April 2025

  const [timeLeft, setTimeLeft] = useState(targetDate.getTime() - Date.now());
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      setIsDialogOpen(true);
      setLoading(false);
      return;
    }
    setLoading(false);
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

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <>
      {!isTimeUp && !loading ? (
        <div className="text-2xl md:text-4xl font-semibold mb-4">
          Time left: {formatTime(timeLeft)}
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="text-4xl font-semibold mb-4">Loading...</div>
          ) : (
            <div className="text-4xl font-semibold mb-4">
              The marathon has ended! 🎉
            </div>
          )}

          <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[425px] sm:max-h-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    The marathon has ended! 🎉
                  </DialogTitle>
                </DialogHeader>
                <div className="text-lg text-center mt-4">
                  Thank you for participating! We hope you enjoyed the marathon.
                </div>

                <DialogFooter>
                  <Link href={"/results"}>
                    <Button className="cursor-pointer">View results</Button>
                  </Link>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </>
  );
}

export default CountdownTimer;
