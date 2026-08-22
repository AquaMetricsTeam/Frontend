import { useMe } from "@/features/auth/hooks/useMe";
import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { UpdateProfileForm } from "./UpdateProfileForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import FullPageLoading from "@/components/feedbacks/FullPageLoading";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";

export function ProfileView() {
  const { data: meRes, isLoading, isError, refetch } = useMe();

  if (isLoading) {
    return <FullPageLoading />;
  }

  if (isError || !meRes?.data) {
    return (
      <div className="py-12">
        <ErrorMessage
          onRetry={() => {
            refetch();
          }}
        />
      </div>
    );
  }

  const user = meRes.data;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto w-full">
      {/* Profile Header Studio */}
      <ProfileHeaderCard user={user} />

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Personal & Contact Information */}
        <UpdateProfileForm user={user} />

        {/* Security & Password */}
        <ChangePasswordForm />
      </div>
    </div>
  );
}
