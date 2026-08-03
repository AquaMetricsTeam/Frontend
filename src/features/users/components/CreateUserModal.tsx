import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
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
import { createUserSchema, staffRoleValues } from "../constants/validations";
import type { CreateUserFormValues } from "../constants/validations";
import type { StaffRole } from "../types/index";
import type { SelectOption } from "@/components/fields/SelectField";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: StaffRole;
  fixedRole?: StaffRole;
}

export function CreateUserModal({
  open,
  onOpenChange,
  defaultRole,
  fixedRole,
}: CreateUserModalProps) {
  const { t } = useTranslation("users");
  const effectiveRole = fixedRole || defaultRole;

  const roleOptions: SelectOption[] = staffRoleValues.map((role) => ({
    value: role,
    label: t(`users:roles.${role}`),
  }));

  const methods = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: effectiveRole,
    },
  });

  const { mutate: createUser, isPending } = useCreateUser(() => {
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      methods.reset({
        fullName: "",
        email: "",
        password: "",
        role: effectiveRole,
      });
    }
  }, [open, methods, effectiveRole]);

  function onSubmit(values: CreateUserFormValues) {
    createUser(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {fixedRole === "Athlete"
              ? t("athletes:page.createButton", { defaultValue: "Add Athlete" })
              : t("users:modal.title")}
          </DialogTitle>
          <DialogDescription>{t("users:modal.description")}</DialogDescription>
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
              label={t("users:modal.fullName")}
              placeholder={t("users:modal.fullNamePlaceholder")}
              required
            />

            <InputField<CreateUserFormValues>
              name="email"
              label={t("users:modal.email")}
              type="email"
              placeholder={t("users:modal.emailPlaceholder")}
              required
              autoComplete="off"
            />

            <InputField<CreateUserFormValues>
              name="password"
              label={t("users:modal.password")}
              type="password"
              placeholder={t("users:modal.passwordPlaceholder")}
              required
              autoComplete="new-password"
            />

            {!fixedRole && (
              <SelectField<CreateUserFormValues>
                name="role"
                label={t("users:modal.role")}
                options={roleOptions}
                placeholder={t("users:modal.rolePlaceholder")}
                required
              />
            )}
          </form>
        </FormProvider>

        <DialogFooter showCloseButton>
          <Button
            type="submit"
            form="create-user-form"
            disabled={isPending}
            className="min-w-24"
          >
            {isPending ? t("users:modal.creating") : t("users:modal.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
