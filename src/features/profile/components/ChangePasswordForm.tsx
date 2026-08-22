import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdLock, MdVpnKey, MdLockReset } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/fields/InputField";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../constants/validations";
import { useChangePassword } from "../hooks/useChangePassword";

export function ChangePasswordForm() {
  const methods = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useChangePassword(() => {
    methods.reset();
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs">
      <div className="border-b border-border/60 pb-4 mb-6">
        <h2 className="text-base font-bold text-foreground">
          Security & Password
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Ensure your account uses a strong password (minimum 6 characters).
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <InputField<ChangePasswordFormValues>
            name="currentPassword"
            label="Current Password"
            type="password"
            placeholder="••••••••"
            required
            startIcon={<MdLock className="size-4 text-muted-foreground" />}
          />

          {/* New Password */}
          <InputField<ChangePasswordFormValues>
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="••••••••"
            required
            startIcon={<MdVpnKey className="size-4 text-muted-foreground" />}
          />

          {/* Confirm New Password */}
          <InputField<ChangePasswordFormValues>
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            required
            startIcon={<MdVpnKey className="size-4 text-muted-foreground" />}
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending}
              variant="outline"
              className="gap-2 rounded-xl px-6 border-border/80 hover:border-primary/50"
            >
              <MdLockReset className="size-4 text-primary" />
              <span>{mutation.isPending ? "Updating..." : "Update Password"}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
