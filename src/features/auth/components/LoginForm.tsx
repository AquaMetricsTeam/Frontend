import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdLock, MdEmail } from "react-icons/md";
import { InputField } from "@/components/fields/InputField";
import { Button } from "@/components/ui/button";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../constants/validations";

export function LoginForm() {
  const { t } = useTranslation("auth");
  const { mutate: login, isPending } = useLogin();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onSubmit = (values: LoginFormValues) => {
    login({
      payload: { email: values.email, password: values.password },
      rememberMe: values.rememberMe,
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="mb-1.5 text-2xl font-bold text-foreground">
            {t("login.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <InputField<LoginFormValues>
            name="email"
            label={t("login.emailLabel")}
            type="email"
            placeholder={t("login.emailPlaceholder")}
            autoComplete="email"
            startIcon={<MdEmail className="size-4" />}
          />

          <InputField<LoginFormValues>
            name="password"
            label={t("login.passwordLabel")}
            type="password"
            placeholder={t("login.passwordPlaceholder")}
            autoComplete="current-password"
            startIcon={<MdLock className="size-4" />}
          />

          {/* <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground select-none">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/5 accent-cyan-400"
              />
              {t("login.rememberMe")}
            </label>
            <button
              type="button"
              className="text-sm text-cyan-400 transition-colors hover:text-cyan-300"
            >
              {t("login.forgotPassword")}
            </button>
          </div> */}

          <Button
            size="lg"
            type="submit"
            disabled={isPending}
            className="group mt-1 w-full"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t("login.authenticating")}
              </span>
            ) : (
              <>
                {t("login.submit")}
                <span className="ms-2 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t("login.poweredBy")}{" "}
          <span className="text-cyan-500 font-semibold">AquaMetrics</span>{" "}
          v2.4.1
        </p>
      </div>
    </FormProvider>
  );
}
