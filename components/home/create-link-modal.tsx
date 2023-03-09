"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

interface FormInput {
  title: string;
  description: string;
  amount: string;
  receiver: string;
}

export function CreateLinkModal() {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const { amount, description, title, receiver } = data;

    const promise = fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        amount: parseFloat(amount),
        receiver,
      }),
    }).then((res) => {
      if (res.statusText === "Unauthorized") {
        alert("Require sign in");
      } else {
        mutate("/api/links");
      }

      setOpen(false);
    });

    toast.promise(promise, {
      loading: "creating...",
      success: "Created link",
      error: "Error when, failed to create",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Link</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                defaultValue="title"
                className="col-span-3"
                {...register("title")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receiver" className="text-right">
                Receiver
              </Label>
              <Input
                id="receiver"
                defaultValue="receiver"
                className="col-span-3"
                {...register("receiver")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                defaultValue="description"
                className="col-span-3"
                {...register("description")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                defaultValue={0.01}
                step={0.01}
                className="col-span-3"
                {...register("amount")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
