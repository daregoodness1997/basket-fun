"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBaskets } from "@/hooks/use-baskets";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Basket name must be at least 2 characters.",
    }),
    rebalanceInterval: z.number().min(1, {
        message: "Rebalance interval must be at least 1 day.",
    }),
    addresses: z
        .array(z.string().min(1, "Token address is required"))
        .min(1, "At least one token address is required"),
});

export default function CreateBasketDialog() {
    const [open, setOpen] = useState(false);
    const { addBasket } = useBaskets();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            rebalanceInterval: 7,
            addresses: [""],
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        addBasket(values);
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create New Basket</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-screen overflow-scroll">
                <DialogHeader>
                    <DialogTitle>Create New Basket</DialogTitle>
                    <DialogDescription>
                        Create a new basket with a name, rebalance interval, and
                        token addresses.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Basket Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="My Basket"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rebalanceInterval"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Rebalance Interval (days)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch("addresses").map((_, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={`addresses.${index}`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Token {index + 1} Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="0x..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            className="mr-2"
                            onClick={() =>
                                form.setValue("addresses", [
                                    ...form.watch("addresses"),
                                    "",
                                ])
                            }
                        >
                            Add Token Address
                        </Button>
                        <Button type="submit">Create Basket</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
