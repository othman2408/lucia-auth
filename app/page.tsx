import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.actions";

export default async function Home() {

  const { user } = await validateRequest();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">

      <form action={signOut}>
        <div className="flex flex-col items-center justify-between">
          <h1 className="text-3xl font-bold">Welcome, {JSON.stringify(user)}</h1>
          <Button type="submit" className="mt-4">Logout</Button>
        </div>
      </form>
    </main>
  );
}
