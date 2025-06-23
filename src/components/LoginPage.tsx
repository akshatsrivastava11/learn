"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { useSignIn } from '@clerk/nextjs';
import {OAuthStrategy} from '@clerk/types'
export default function LoginPage() {
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [verify, setverify] = useState(false);
  const [code, setcode] = useState("");
  const { isLoaded, signIn, setActive } = useSignIn();

  const signInWith=async (strategy:OAuthStrategy)=>{
    const response=await signIn?.authenticateWithRedirect({
      redirectUrl:'/login/sso-callback',
      strategy:strategy,
      redirectUrlComplete:'/dashboard'
    })

  
  console.log(response);
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const response = await signIn.create({
        identifier: email,
        password: pass,
      });
      if (response.status === 'complete') {
        await setActive({ session: response.createdSessionId });
        console.log("User signed in");
      } else if (response.status === 'needs_first_factor') {
        setverify(true);
      }
    } catch (error) {
      console.log("An error occurred ", error);
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const attempt = await signIn.attemptFirstFactor({ strategy: 'email_code', code });
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
        console.log("User verified and signed in");
      } else {
        setverify(true);
      }
    } catch (error) {
      console.log("An error occurred ", error);
    }
  };

  return (
    <div className="flex items-center justify-center py-50">
      <div className="shadow-input  mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Login to aceternity if you can because we don&apos;t have a login flow
          yet
        </p>
        {!verify ? (
          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="projectmayhem@fc.com" type="email" value={email} onChange={e => setemail(e.target.value)} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="••••••••" type="password" value={pass} onChange={e => setpass(e.target.value)} />
            </LabelInputContainer>
            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
            >
              Login &rarr;
              <BottomGradient />
            </button>
            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            <div className="flex flex-col space-y-4">
              <button
                className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                type="button"
              >
                <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  GitHub
                </span>
                <BottomGradient />
              </button>
              <button
                className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                type="button"
                onClick={()=>signInWith('oauth_google')}

              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Google
                </span>
                <BottomGradient />
              </button>
            </div>
          </form>
        ) : (
          <form className="my-8" onSubmit={handleVerify}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="code">Verification Code</Label>
              <Input id="code" placeholder="Enter the code sent to your email" type="text" value={code} onChange={e => setcode(e.target.value)} maxLength={6} />
            </LabelInputContainer>
            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] mt-2"
              type="submit"
            >
              Verify &rarr;
              <BottomGradient />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
