import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  MdPhone,
  MdCalendarToday,
  MdSave,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/fields/InputField";
import { SelectField } from "@/components/fields/SelectField";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "../constants/validations";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import type { AuthUser } from "@/features/auth/types";

interface UpdateProfileFormProps {
  user: AuthUser;
}

export function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const { t } = useTranslation(["profile", "common"]);
  const mutation = useUpdateProfile();

  const genderOptions = [
    { value: "1", label: t("common:gender.male") },
    { value: "2", label: t("common:gender.female") },
  ];

  const methods = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      phoneNumber: user.phoneNumber || "",
      emergencyContact: user.emergencyContact || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      gender:
        user.gender !== undefined && user.gender !== null ? user.gender : 0,
      medicalNotes: user.medicalNotes || "",
    },
  });

  const onSubmit = (values: UpdateProfileFormValues) => {
    mutation.mutate({
      phoneNumber: values.phoneNumber,
      emergencyContact: values.emergencyContact || null,
      dateOfBirth: values.dateOfBirth || null,
      gender: values.gender !== undefined ? Number(values.gender) : null,
      medicalNotes: values.medicalNotes || null,
    });
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs">
      <div className="border-b border-border/60 pb-4 mb-6">
        <h2 className="text-base font-bold text-foreground">
          {t("profile:info.title")}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("profile:info.description")}
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          {/* Phone Number */}
          <InputField<UpdateProfileFormValues>
            name="phoneNumber"
            label={t("profile:info.phoneNumber")}
            placeholder={t("profile:info.phoneNumberPlaceholder")}
            required
            startIcon={<MdPhone className="size-4 text-muted-foreground" />}
          />

          {/* Date of Birth & Gender Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField<UpdateProfileFormValues>
              name="dateOfBirth"
              label={t("profile:info.dateOfBirth")}
              type="date"
              startIcon={
                <MdCalendarToday className="size-4 text-muted-foreground" />
              }
            />

            <SelectField<UpdateProfileFormValues>
              name="gender"
              label={t("profile:info.gender")}
              options={genderOptions}
              valueType="number"
              placeholder={t("profile:info.genderPlaceholder")}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="gap-2 rounded-xl px-6"
            >
              <MdSave className="size-4" />
              <span>
                {mutation.isPending
                  ? t("common:saving")
                  : t("profile:info.save")}
              </span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
