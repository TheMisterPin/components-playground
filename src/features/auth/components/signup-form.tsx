"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerAction } from "@/features/auth/actions/auth-actions";
import {
  registerSchema,
  type RegisterInput,
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
import { USER_DASHBOARD_PATH } from "@/lib/constants";

type SignupFormProps = {
  onSwitchToLogin?: () => void;
};

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const router = useRouter();
  const { handleActionError, handleActionSuccess } = useAppNotifications();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    try {
      await registerAction(values);
      handleActionSuccess("Your account is ready.");
      router.push(USER_DASHBOARD_PATH);
      router.refresh();
    } catch (error) {
      handleActionError(error, {
        title: "Sign up failed",
        fallbackMessage: "Unable to create account",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Submit tickets and track their resolution.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      autoComplete="new-password"
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
              {form.formState.isSubmitting ? "Creating account…" : "Sign up"}
            </Button>
            {onSwitchToLogin ? (
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline"
                  onClick={onSwitchToLogin}
                >
                  Sign in
                </button>
              </p>
            ) : null}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
