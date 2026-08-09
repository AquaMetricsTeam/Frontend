import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdSearch } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import Box from "@/components/layouts/Box";
import { Input } from "@/components/ui/input";
import { PlansList, PlanDetailPanel } from "@/features/nutrition/components/PlansList";
import { AssignmentsList } from "@/features/nutrition/components/AssignmentsList";
import { AssignmentDetailSlideOver } from "@/features/nutrition/components/AssignmentDetailSlideOver";
import { PlanWizardSlideOver } from "@/features/nutrition/components/PlanWizardSlideOver";
import { AssignPlanSlideOver } from "@/features/nutrition/components/AssignPlanSlideOver";
import { ActiveAssignmentsWarningDialog } from "@/features/nutrition/components/ActiveAssignmentsWarningDialog";
import { RoleSwitcher, AdminBanner } from "@/features/nutrition/components/RoleSwitcher";
import { useNutritionPageManager } from "@/features/nutrition/hooks/useNutritionPageManager";
import { Button } from "@/components/ui/button";
import type { NutritionPlan, NutritionPlanAssignment } from "@/features/nutrition/types/index";

type Tab = "plans" | "assignments";
type UserRole = "NutritionSpecialist" | "Administrator";

export default function NutritionPage() {
  const { t } = useTranslation("nutrition");
  const [currentRole, setCurrentRole] = useState<UserRole>("NutritionSpecialist");
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);
  const [plansSearch, setPlansSearch] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<NutritionPlanAssignment | null>(null);
  const [assignmentDetailOpen, setAssignmentDetailOpen] = useState(false);
  
  const {
    currentTab,
    setCurrentTab,
    canEdit: originalCanEdit,
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
  } = useNutritionPageManager();

  // Override canEdit based on role switcher
  const canEdit = currentRole === "NutritionSpecialist" && originalCanEdit;
  const isAdminView = currentRole === "Administrator";

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
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1
            className="text-xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("page.title")}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("page.description")}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Role Switcher */}
          <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>
      </div>

      {/* Admin Banner */}
      {isAdminView && <AdminBanner className="mb-6" />}

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-border">
        {["plans", "assignments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab as Tab)}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
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
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-80">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
            <Input
              type="text"
              placeholder={t("list.searchPlaceholder")}
              value={plansSearch}
              onChange={(e) => setPlansSearch(e.target.value)}
              className="pl-9 bg-slate-800/60 border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:ring-slate-600 h-8"
            />
          </div>
          {canEdit && (
            <Button
              onClick={handleCreatePlan}
              className="bg-[#06B6D4] hover:bg-[#0891B2] text-white text-xs h-8 px-3 py-1.5"
            >
              <MdAdd className="size-3.5" />
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
            <div className="rounded-xl border border-slate-800 bg-[#111827]">
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
            <div className="rounded-xl border border-slate-800 bg-[#111827] p-6">
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
