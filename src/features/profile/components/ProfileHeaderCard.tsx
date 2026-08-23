import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  MdCameraAlt,
  MdMailOutline,
  MdShield,
  MdVerified,
  MdRefresh,
} from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUploadProfilePicture } from "../hooks/useUploadProfilePicture";
import type { AuthUser } from "@/features/auth/types";

interface ProfileHeaderCardProps {
  user: AuthUser;
}

function getInitials(name: string): string {
  if (!name) return "US";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ProfileHeaderCard({ user }: ProfileHeaderCardProps) {
  const { t } = useTranslation(["profile", "common"]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadProfilePicture();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const rawRole = user.roles?.[0] ?? "Member";
  const roleLabel = t(`common:roles.${rawRole}`, { defaultValue: rawRole });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none absolute -top-24 -end-24 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar with Upload Overlay */}
        <div className="group relative shrink-0">
          <Avatar className="size-24 sm:size-28 rounded-3xl ring-4 ring-background shadow-md">
            <AvatarImage
              src={user.profilePictureUrl || undefined}
              alt={user.fullName}
              className="object-cover"
            />
            <AvatarFallback className="rounded-3xl bg-primary/15 text-primary font-bold text-2xl">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>

          {/* Upload trigger button overlay */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-black/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer disabled:opacity-100"
            title={t("profile:header.changePhoto")}
          >
            {uploadMutation.isPending ? (
              <MdRefresh className="size-6 animate-spin" />
            ) : (
              <>
                <MdCameraAlt className="size-6" />
                <span className="text-[10px] font-semibold mt-1">
                  {t("profile:header.changePhoto")}
                </span>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* User Details */}
        <div className="flex-1 text-center sm:text-start space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {user.fullName}
            </h1>
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              <MdShield className="size-3.5" />
              <span>{roleLabel}</span>
            </Badge>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <MdMailOutline className="size-4 text-primary shrink-0" />
              <span>{user.email}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <MdVerified className="size-3.5" />
              <span>{t("profile:header.activeAccount")}</span>
            </span>
          </div>

          <p className="text-xs text-muted-foreground/80 max-w-xl pt-1">
            {t("profile:header.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
