"use client";

import { useUser } from "@/context/authContext";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { DropdownMenu } from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { signOut } from "@/lib/firebase/auth";

function Header() {
  const { user } = useUser();
  console.log(user);
  return (
    <div className=" flex justify-between items-center p-4 py-8 w-full h-16 bg-white">
      <div>
        <h1 className="font-bold text-3xl md:text-5xl">CSS Abacus 2025</h1>
      </div>
      {user !== null && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center border-2 p-2 rounded-full border-gray-300 bg-white shadow-md cursor-pointer hover:bg-gray-100">
              <User />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => signOut()}
              >
                {" "}
                <LogOut className="mr-2" />
                Sign out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default Header;
