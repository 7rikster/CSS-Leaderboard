import Leaderboard from "@/components/leaderBoard";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center  p-4 pt-16 w-full">
      <Leaderboard title="Open Source" />
    </div>
  );
}
