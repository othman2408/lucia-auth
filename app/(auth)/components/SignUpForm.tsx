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
import { SingUpSchema } from "@/app/types/ZodSchemas"



// SignUpForm component
export default function SignUpForm() {

    // useForm hook
    const form = useForm<z.infer<typeof SingUpSchema>>({
        resolver: zodResolver(SingUpSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    })


    // onSubmit function
    function onSubmit(values: z.infer<typeof SingUpSchema>) {
        console.log(values)
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
                                <Input placeholder="enter a usernaem" {...field} />
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
                {/* CONFIRM PASSWORD fields */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="confirm your password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                {/* SUBMIT BUTTON */}
                <Button type="submit">Sign Up</Button>
            </form>
        </Form>
    )
}