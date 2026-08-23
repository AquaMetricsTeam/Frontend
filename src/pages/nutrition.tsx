import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import Box from "@/components/layouts/Box";
import { SearchInput } from "@/components/common/SearchInput";
import { useAuth } from "@/components/Providers/AuthProvider";
import UnauthorizedPage from "@/pages/unauthorized";
import FullPageLoading from "@/components/feedbacks/FullPageLoading";
import { PlansList, PlanDetailPanel } from "@/features/nutrition/components/PlansList";
import { AssignmentsList } from "@/features/nutrition/components/AssignmentsList";
import { AssignmentDetailSlideOver } from "@/features/nutrition/components/AssignmentDetailSlideOver";
import { PlanWizardSlideOver } from "@/features/nutrition/components/PlanWizardSlideOver";
import { AssignPlanSlideOver } from "@/features/nutrition/components/AssignPlanSlideOver";
import { ActiveAssignmentsWarningDialog } from "@/features/nutrition/components/ActiveAssignmentsWarningDialog";
import { useNutritionPageManager } from "@/features/nutrition/hooks/useNutritionPageManager";
import { Button } from "@/components/ui/button";
import type { NutritionPlan, NutritionPlanAssignment } from "@/features/nutrition/types/index";

type Tab = "plans" | "assignments";

export default function NutritionPage() {
  const { t } = useTranslation("nutrition");
  const { hasAnyRole, isLoading, isAuthenticated } = useAuth();
  const canAccess = hasAnyRole(["NutritionSpecialist"]);
  if (isLoading) {
    return <FullPageLoading />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!canAccess) {
    return <UnauthorizedPage />;
  }
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);
  const [plansSearch, setPlansSearch] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<NutritionPlanAssignment | null>(null);
  const [assignmentDetailOpen, setAssignmentDetailOpen] = useState(false);
  
  const {
    currentTab,
    setCurrentTab,
    canEdit,
    wizardOpen,
    setWizardOpen,
    editingPlan,
    assignPlanSlideOverOpen,
    setAssignPlanSlideOverOpen,
    selectedPlanForAssign,
    warningDialogOpen,
    setWarningDialogOpen,
    warningAction,
    activeAssignmentCount,

    isCreating,
    isUpdating,
    isDeleting,
    handleCreatePlan,
    handleEditPlan,
    handleConfirmEdit,
    handleDeletePlan,
    handleConfirmDelete,
    handleDuplicatePlan,
    handleAssignPlan,
    handleSubmitPlan,
    isDuplicate,
    // new sync fields
    deletedPlanId,
    isDeleteSuccess,
  } = useNutritionPageManager();

  // Clear selected plan when the currently displayed plan is deleted
  useEffect(() => {
    if (isDeleteSuccess && selectedPlan && deletedPlanId === selectedPlan.id) {
      setSelectedPlan(null);
    }
  }, [isDeleteSuccess, deletedPlanId, selectedPlan]);

  const handleAssignmentClick = (assignment: NutritionPlanAssignment) => {
    setSelectedAssignment(assignment);
    setAssignmentDetailOpen(true);
  };

  const handleViewFullPlan = () => {
    // Switch to plans tab and select the plan
    setCurrentTab("plans");
    // TODO: Find and select the plan by ID
    // This would need to be implemented with the actual plan selection logic
  };

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("page.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("page.description")}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-border">
        {(["plans", "assignments"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setCurrentTab(tab as Tab)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              currentTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(`tab.${tab}`)}
          </button>
        ))}
      </div>

      {/* Action Bar – only on Plans tab */}
      {currentTab === "plans" && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <SearchInput
            value={plansSearch}
            onChange={setPlansSearch}
            placeholder={t("list.searchPlaceholder")}
          />
          {canEdit && (
            <Button
              size="sm"
              onClick={handleCreatePlan}
              className="h-9 rounded-lg gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <MdAdd className="size-4" />
              {t("list.createButton")}
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      {currentTab === "plans" ? (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Plans List */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <PlansList
                search={plansSearch}

                selectedPlanId={selectedPlan?.id}
                onSelectPlan={setSelectedPlan}
                onEditPlan={canEdit ? handleEditPlan : undefined}
                onDuplicatePlan={canEdit ? handleDuplicatePlan : undefined}
                onDeletePlan={canEdit ? handleDeletePlan : undefined}
                onAssignPlan={canEdit ? handleAssignPlan : undefined}
                canEdit={canEdit}
              />
            </div>
          </div>

          {/* Right Column - Plan Detail */}
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-xl border border-border bg-card p-6">
              <PlanDetailPanel
                plan={selectedPlan}
                onEditPlan={canEdit ? handleEditPlan : undefined}
                onDuplicatePlan={canEdit ? handleDuplicatePlan : undefined}
                onAssignPlan={canEdit ? handleAssignPlan : undefined}
                canEdit={canEdit}
                activeAssignments={selectedPlan ? (selectedPlan as any)._activeAssignmentsCount ?? 0 : 0}
              />
            </div>
          </div>
        </div>
      ) : (
        <Box>
          <div className="p-6">
            <AssignmentsList onAssignmentClick={handleAssignmentClick} />
          </div>
        </Box>
      )}

      {/* Modals & Slide-Overs */}
      <PlanWizardSlideOver
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        initialPlan={editingPlan}
        isLoading={isCreating || isUpdating}
        onSubmit={handleSubmitPlan}
        isDuplicate={isDuplicate}
      />

      <AssignPlanSlideOver
        open={assignPlanSlideOverOpen}
        onOpenChange={setAssignPlanSlideOverOpen}
        plan={selectedPlanForAssign}
      />

      <AssignmentDetailSlideOver
        open={assignmentDetailOpen}
        onOpenChange={setAssignmentDetailOpen}
        assignment={selectedAssignment}
        onViewFullPlan={handleViewFullPlan}
      />

      <ActiveAssignmentsWarningDialog
        open={warningDialogOpen}
        onOpenChange={setWarningDialogOpen}
        activeAssignmentCount={activeAssignmentCount}
        action={warningAction}
        onConfirm={warningAction === "delete" ? handleConfirmDelete : handleConfirmEdit}
        isLoading={isDeleting || isUpdating}
      />
    </PageWrapper>
  );
}
