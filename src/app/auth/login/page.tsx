"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from ".././../../components/ui/card";
import { signIn } from "../../../lib/firebase/auth";
import { toast } from "sonner";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logging, setLogging] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  function handleSignIn(event: any) {
    event.preventDefault();
    setLogging(true);

    if (email && password) {
      signIn(email, password)
        .then((user) => {
          if (user?.uid) {
            toast.success("User Signed in Successfully");
            setLogging(false);
            setTimeout(() => {
              router.refresh();
              router.push(typeof redirect === "string" ? redirect : "/");
            }, 1000);
          } else {
            toast("Something went wrong");
          }
        })
        .catch((e) => {
          setLogging(false);
          console.log(e);
          const errorCode = e.code;
          const errorMessage = e.message;
          if (errorCode === "auth/invalid-credential") {
            toast("Invalid credentials!");
          } else if (errorCode === "auth/invalid-email") {
            toast("Enter an email!");
          } else if (errorCode === "auth/missing-password") {
            toast("Enter the password!");
          } else {
            toast(`${errorMessage}`);
          }
        });
    } else {
      setLogging(false);
      toast.error("Please fill all the fields");
    }
  }

  useEffect(() => {
    toast("This login is for admins only");
  }, []);

  return (
    <main className="h-screen flex items-center justify-center ">
      <Card className="p-6 space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back!!</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br />

          <Button
            className="w-full bg-primary mt-4"
            onClick={handleSignIn}
            type="submit"
            disabled={logging}
          >
            {logging ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default LogIn;
