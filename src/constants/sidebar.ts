import {
  MdDashboard,
  MdPeople,
  MdDirectionsRun,
  MdPool,
  MdFitnessCenter,
  MdAssignment,
  MdRestaurant,
  MdEventNote,
  MdStickyNote2,
  MdAutoAwesome,
  MdMenuBook,
  MdNotifications,
  MdBarChart,
  MdSettings,
  MdGroup,
  MdSportsGymnastics,
} from "react-icons/md";

export const NAV_GROUPS: NavGroup[] = [
  {
    groupKey: "overview",
    labelKey: "common:nav.groups.overview",
    items: [
      {
        key: "dashboard",
        labelKey: "common:nav.items.dashboard",
        icon: MdDashboard,
        path: "/",
      },
    ],
  },
  {
    groupKey: "people",
    labelKey: "common:nav.groups.people",
    items: [
      {
        key: "usersStaff",
        labelKey: "common:nav.items.usersStaff",
        icon: MdPeople,
        path: "/users",
        allowedRoles: ["Admin"],
      },
      {
        key: "athletes",
        labelKey: "common:nav.items.athletes",
        icon: MdDirectionsRun,
        path: "/athletes",
        allowedRoles: [
          "Admin",
          "SwimmingCoach",
          "FitnessCoach",
          "NutritionSpecialist",
        ],
      },
      {
        key: "groups",
        labelKey: "common:nav.items.groups",
        icon: MdGroup,
        path: "/groups",
        allowedRoles: ["SwimmingCoach", "FitnessCoach", "NutritionSpecialist"],
      },
    ],
  },
  {
    groupKey: "programs",
    labelKey: "common:nav.groups.programs",
    items: [
      {
        key: "swimming",
        labelKey: "common:nav.items.swimming",
        icon: MdPool,
        path: "/swimming",
      },
      {
        key: "fitness",
        labelKey: "common:nav.items.fitness",
        icon: MdFitnessCenter,
        path: "/fitness",
      },
      {
        key: "exercises",
        labelKey: "common:nav.items.exercises",
        icon: MdSportsGymnastics,
        path: "/exercises",
        allowedRoles: ["SwimmingCoach", "FitnessCoach", "NutritionSpecialist"],
      },
      {
        key: "trainingPlans",
        labelKey: "common:nav.items.trainingPlans",
        icon: MdAssignment,
        path: "/training-plans",
      },
      {
        key: "nutrition",
        labelKey: "common:nav.items.nutrition",
        icon: MdRestaurant,
        path: "/nutrition",
      },
    ],
  },
  {
    groupKey: "operations",
    labelKey: "common:nav.groups.operations",
    items: [
      {
        key: "attendance",
        labelKey: "common:nav.items.attendance",
        icon: MdEventNote,
        path: "/attendance",
      },
      {
        key: "coachNotes",
        labelKey: "common:nav.items.coachNotes",
        icon: MdStickyNote2,
        path: "/coach-notes",
      },
      {
        key: "aiRecommendations",
        labelKey: "common:nav.items.aiRecommendations",
        icon: MdAutoAwesome,
        path: "/ai-recommendations",
        badge: 12,
      },
    ],
  },
  {
    groupKey: "resources",
    labelKey: "common:nav.groups.resources",
    items: [
      {
        key: "knowledgeBase",
        labelKey: "common:nav.items.knowledgeBase",
        icon: MdMenuBook,
        path: "/knowledge-base",
      },
      {
        key: "notifications",
        labelKey: "common:nav.items.notifications",
        icon: MdNotifications,
        path: "/notifications",
      },
      {
        key: "reports",
        labelKey: "common:nav.items.reports",
        icon: MdBarChart,
        path: "/reports",
      },
    ],
  },
  {
    groupKey: "system",
    labelKey: "common:nav.groups.system",
    items: [
      {
        key: "settings",
        labelKey: "common:nav.items.settings",
        icon: MdSettings,
        path: "/settings",
      },
    ],
  },
];
