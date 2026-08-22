import PageWrapper from "@/components/layouts/PageWrapper";
import { ProfileView } from "@/features/profile/components/ProfileView";

export default function ProfilePage() {
  return (
    <PageWrapper className="overflow-y-auto">
      <ProfileView />
    </PageWrapper>
  );
}
