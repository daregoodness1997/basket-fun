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
    tokens: z
        .array(
            z.object({
                symbol: z.string().min(1, "Token symbol is required"),
                address: z.string().min(1, "Token address is required"),
                allocation: z
                    .number()
                    .min(0, "Allocation must be positive")
                    .max(100, "Allocation cannot exceed 100%"),
            })
        )
        .min(1, "At least one token is required"),
});

export default function CreateBasketDialog() {
    const [open, setOpen] = useState(false);
    const { addBasket } = useBaskets();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            rebalanceInterval: 7,
            tokens: [{ symbol: "", address: "", allocation: 0 }],
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
                        tokens.
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
                                    <FormDescription>
                                        Enter a name for your new basket.
                                    </FormDescription>
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
                                    <FormDescription>
                                        Enter the number of days between
                                        rebalances.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch("tokens").map((_, index) => (
                            <div key={index} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name={`tokens.${index}.symbol`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Token {index + 1} Symbol
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ETH"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`tokens.${index}.address`}
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
                                <FormField
                                    control={form.control}
                                    name={`tokens.${index}.allocation`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Token {index + 1} Allocation (%)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                form.setValue("tokens", [
                                    ...form.watch("tokens"),
                                    { symbol: "", address: "", allocation: 0 },
                                ])
                            }
                        >
                            Add Token
                        </Button>
                        <Button type="submit">Create Basket</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
