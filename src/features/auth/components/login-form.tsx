"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginAction } from "@/features/auth/actions/auth-actions";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schema/auth-schema";
import { useAppNotifications } from "@/hooks/use-app-notifications";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AGENT_PORTAL_PATH, USER_DASHBOARD_PATH } from "@/lib/constants";

type LoginFormProps = {
  onSwitchToSignup?: () => void;
};

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const router = useRouter();
  const { handleActionError, handleActionSuccess } = useAppNotifications();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    try {
      await loginAction(values);
      handleActionSuccess("Welcome back.");
      router.push(USER_DASHBOARD_PATH);
      router.refresh();
    } catch (error) {
      handleActionError(error, {
        title: "Sign in failed",
        fallbackMessage: "Unable to sign in",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
            {onSwitchToSignup ? (
              <p className="text-muted-foreground text-sm">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline"
                  onClick={onSwitchToSignup}
                >
                  Sign up
                </button>
              </p>
            ) : null}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
