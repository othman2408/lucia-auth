"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SingInSchema } from "@/app/types/ZodSchemas"
import { signIn } from "@/lib/actions/auth.actions"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"



// SignUpForm component
export default function SignUpForm() {

    const router = useRouter();

    // useForm hook
    const form = useForm<z.infer<typeof SingInSchema>>({
        resolver: zodResolver(SingInSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })


    // onSubmit function
    async function onSubmit(values: z.infer<typeof SingInSchema>) {
        // console.log(values)

        const res = await signIn(values);


        if (res.error) {
            toast({
                variant: "destructive",
                description: res.error,
            })

            // Reset the form
            form.reset();
        } else {
            toast({
                variant: "default",
                description: "You have successfully signed in!"
            })

            // Reset the form
            form.reset();

            // Redirect to the home page
            router.push("/");

        }

    }


    return (

        /* Form component */
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                {/* USER fields */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="enter a usernaem"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                {/* PASSWORD fields */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="enter a password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                {/* SUBMIT BUTTON */}
                <Button type="submit">Sign in</Button>
            </form>
        </Form>
    )
}