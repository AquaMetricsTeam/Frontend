import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/Providers/AuthProvider";
import { useCreateNutritionPlan } from "./useCreateNutritionPlan";
import { useUpdateNutritionPlan } from "./useUpdateNutritionPlan";
import { useDeleteNutritionPlan } from "./useDeleteNutritionPlan";
import { usePlanAssignments } from "./usePlanAssignments";
import type { NutritionPlan, NutritionPlanMeal, NutritionPlanFormValues, MealType } from "../types/index";

type Tab = "plans" | "assignments";

export function useNutritionPageManager() {
  const { hasRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab management
  const currentTab = (searchParams.get("tab") as Tab) || "plans";
  const setCurrentTab = useCallback(
    (tab: Tab) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", tab);
        return next;
      });
    },
    [setSearchParams]
  );

  // Role-based access
  const isNutritionSpecialist = hasRole("NutritionSpecialist");
  const canEdit = isNutritionSpecialist;

  // State management
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<NutritionPlanFormValues | null>(null);
  const [assignPlanSlideOverOpen, setAssignPlanSlideOverOpen] = useState(false);
  const [selectedPlanForAssign, setSelectedPlanForAssign] = useState<NutritionPlan | null>(null);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [warningPlanId, setWarningPlanId] = useState<string | null>(null);
  const [warningAction, setWarningAction] = useState<"edit" | "delete">("edit");
  const [selectedAssignmentPlan, setSelectedAssignmentPlan] = useState<string>("");

  // Mutations
  const { mutate: createPlan, isPending: isCreating } = useCreateNutritionPlan(() => {
    setWizardOpen(false);
    setIsDuplicate(false);
  });

  const { mutate: updatePlan, isPending: isUpdating } = useUpdateNutritionPlan(() => {
    setWizardOpen(false);
    setEditingPlan(null);
    setIsDuplicate(false);
  });

  const { mutate: deletePlan, isPending: isDeleting } = useDeleteNutritionPlan(() => {
    setWarningDialogOpen(false);
  });

  // Fetch active assignments for warning dialog
  const { data: assignmentsRes } = usePlanAssignments(
    warningPlanId || "",
    {},
    !!warningPlanId
  );
  const activeAssignmentCount = Array.isArray(assignmentsRes?.data) ? assignmentsRes.data.length : 0;

  // Handler functions
  // Track if current action is duplicate
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleCreatePlan = useCallback(() => {
    setEditingPlan(null);
    setIsDuplicate(false);
    setWizardOpen(true);
  }, []);

  const handleEditPlan = useCallback(
    (plan: NutritionPlan) => {
      if (!canEdit) return;
      setWarningPlanId(plan.id);
      setWarningAction("edit");
      // Normalise IDs: API may return numbers even though TS types say string.
      const formValues: NutritionPlanFormValues = {
        id: String(plan.id),
        name: plan.name,
        objective: plan.objective || "",
        schedule: plan.schedule || "",
        targetCalories: 0,
        meals: (plan.meals || []).map((m) => ({
          id: m.id != null ? String(m.id) : undefined,
          // Ensure mealType is a valid enum/value number
          mealType: Number(m.mealType) as MealType,
          description: m.description ?? "",
          // Numeric macro fields must be numbers (default 0) to satisfy schema
          calories: m.calories != null ? Number(m.calories) : 0,
          proteinGrams: m.proteinGrams != null ? Number(m.proteinGrams) : 0,
          carbGrams: m.carbGrams != null ? Number(m.carbGrams) : 0,
          fatGrams: m.fatGrams != null ? Number(m.fatGrams) : 0,
          dietaryNotes: m.dietaryNotes ?? "",
        })),
      };
      setEditingPlan(formValues);
      setIsDuplicate(false);
      setWarningDialogOpen(true);
    },
    [canEdit]
  );

  const handleConfirmEdit = useCallback(() => {
    setWizardOpen(true);
    setWarningDialogOpen(false);
  }, []);

  const handleDeletePlan = useCallback(
    (plan: NutritionPlan) => {
      if (!canEdit) return;
      setWarningPlanId(plan.id);
      setWarningAction("delete");
      setWarningDialogOpen(true);
    },
    [canEdit]
  );

  const handleConfirmDelete = useCallback(() => {
    if (warningPlanId) {
      deletePlan(warningPlanId);
    }
  }, [warningPlanId, deletePlan]);

  const handleDuplicatePlan = useCallback(
    (plan: NutritionPlan) => {
      if (!canEdit) return;
      const formValues: NutritionPlanFormValues = {
        id: undefined, // duplicate → new plan, no id
        name: plan.name,
        objective: plan.objective || "",
        schedule: plan.schedule || "",
        targetCalories: 0,
        meals: (plan.meals || []).map((m) => ({
          id: undefined, // duplicate meals get fresh ids from the server
          // Ensure mealType is a valid enum/value number
          mealType: Number(m.mealType) as MealType,
          description: m.description ?? "",
          calories: Number(m.calories) || 0,
          proteinGrams: Number(m.proteinGrams) || 0,
          carbGrams: Number(m.carbGrams) || 0,
          fatGrams: Number(m.fatGrams) || 0,
          dietaryNotes: m.dietaryNotes ?? "",
        })),
      };
      setEditingPlan(formValues);
      setIsDuplicate(true);
      setWizardOpen(true);
    },
    [canEdit]
  );

  const handleAssignPlan = useCallback(
    (plan: NutritionPlan) => {
      if (!canEdit) return;
      setSelectedPlanForAssign(plan);
      setAssignPlanSlideOverOpen(true);
    },
    [canEdit]
  );

  const handleSubmitPlan = useCallback(
    (data: NutritionPlanFormValues) => {
      // Clean up meals payload: ensure mealType and macro values are numeric numbers, not undefined/null
      const cleanMeals: NutritionPlanMeal[] = (data.meals || []).map((m) => ({
        id: m.id,
        mealType: Number(m.mealType) as NutritionPlanMeal["mealType"],
        description: m.description || "",
        calories: Number(m.calories) || 0,
        proteinGrams: Number(m.proteinGrams) || 0,
        carbGrams: Number(m.carbGrams) || 0,
        fatGrams: Number(m.fatGrams) || 0,
        dietaryNotes: m.dietaryNotes || "",
      }));

      const planPayload = {
        name: data.name,
        objective: data.objective || "",
        schedule: data.schedule || "",
        meals: cleanMeals,
      };

      if (editingPlan && editingPlan.id) {
        updatePlan({
          ...planPayload,
          id: String(editingPlan.id),
        });
      } else {
        createPlan(planPayload);
      }
    },
    [editingPlan, updatePlan, createPlan]
  );

  const handleSetSelectedAssignmentPlan = useCallback((planId: string) => {
    setSelectedAssignmentPlan(planId);
  }, []);

  return {
    // Tab state
    currentTab,
    setCurrentTab,

    // Access control
    canEdit,

    // Wizard state
    wizardOpen,
    setWizardOpen,
    editingPlan,
    setEditingPlan,
    isDuplicate,

    // Assignment slide-over state
    assignPlanSlideOverOpen,
    setAssignPlanSlideOverOpen,
    selectedPlanForAssign,

    // Warning dialog state
    warningDialogOpen,
    setWarningDialogOpen,
    warningAction,
    activeAssignmentCount,

    // Assignment list state
    selectedAssignmentPlan,
    setSelectedAssignmentPlan: handleSetSelectedAssignmentPlan,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Handlers
    handleCreatePlan,
    handleEditPlan,
    handleConfirmEdit,
    handleDeletePlan,
    handleConfirmDelete,
    handleDuplicatePlan,
    handleAssignPlan,
    handleSubmitPlan,
  };
}
