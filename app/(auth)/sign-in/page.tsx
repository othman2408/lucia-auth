import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import SignInForm from "@/app/(auth)/components/SignInForm";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

export default async function SignUp() {

    const { user } = await validateRequest();

    // If the user is already signed in, redirect to the home page
    if (user) {
        return redirect("/");
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Sign in to access the app</CardDescription>
                </CardHeader>
                <CardContent>
                    <SignInForm />
                </CardContent>
            </Card>
        </div>
    );
}