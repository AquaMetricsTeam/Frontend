import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/fields/InputField";
import { SelectField } from "@/components/fields/SelectField";
import { useCreateUser } from "../hooks/useCreateUser";
import { createUserSchema } from "../constants/validations";
import { ROLE_FILTER_LABELS, staffRoleValues } from "../constants/validations";
import type { CreateUserFormValues } from "../constants/validations";
import type { SelectOption } from "@/components/fields/SelectField";

const ROLE_OPTIONS: SelectOption[] = staffRoleValues.map((role) => ({
  value: role,
  label: ROLE_FILTER_LABELS[role],
}));

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
  const methods = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const { mutate: createUser, isPending } = useCreateUser(() => {
    onOpenChange(false);
  });

  // Reset form whenever modal is reopened
  useEffect(() => {
    if (open) methods.reset();
  }, [open, methods]);

  function onSubmit(values: CreateUserFormValues) {
    createUser(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Add a new staff member to the academy.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            id="create-user-form"
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-2"
            noValidate
          >
            <InputField<CreateUserFormValues>
              name="fullName"
              label="Full Name"
              placeholder="e.g. John Smith"
              required
            />

            <InputField<CreateUserFormValues>
              name="email"
              label="Email"
              type="email"
              placeholder="john@example.com"
              required
              autoComplete="off"
            />

            <InputField<CreateUserFormValues>
              name="password"
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
            />

            <SelectField<CreateUserFormValues>
              name="role"
              label="Role"
              options={ROLE_OPTIONS}
              placeholder="Select a role"
              required
            />
          </form>
        </FormProvider>

        <DialogFooter showCloseButton>
          <Button
            type="submit"
            form="create-user-form"
            disabled={isPending}
            className="min-w-24"
          >
            {isPending ? "Creating…" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
