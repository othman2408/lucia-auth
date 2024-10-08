import SignUpForm from "@/app/(auth)/components/SignUpForm";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

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
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Sign up to access the app</CardDescription>
                </CardHeader>
                <CardContent>
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    );
}