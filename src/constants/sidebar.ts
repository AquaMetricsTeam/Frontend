import {
  MdDashboard,
  MdPeople,
  MdDirectionsRun,
  MdHowToReg,
  MdPool,
  MdStickyNote2,
  MdAutoAwesome,
  MdMenuBook,
  MdNotifications,
  MdBarChart,
  MdGroup,
  MdSportsGymnastics,
  MdRestaurant,
  MdFitnessCenter,
  MdEvent,
  MdAssignment,
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
        allowedRoles: ["Admin", "SwimmingCoach", "FitnessCoach"],
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
        key: "athleteRegistrations",
        labelKey: "common:nav.items.athleteRegistrations",
        icon: MdHowToReg,
        path: "/athlete-registrations",
        allowedRoles: ["Admin"],
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
        key: "exercises",
        labelKey: "common:nav.items.exercises",
        icon: MdSportsGymnastics,
        path: "/exercises",
        allowedRoles: ["SwimmingCoach", "FitnessCoach"],
      },
      {
        key: "trainingTemplates",
        labelKey: "common:nav.items.trainingTemplates",
        icon: MdPool,
        path: "/training-templates",
        allowedRoles: ["SwimmingCoach", "FitnessCoach"],
      },
      {
        key: "trainingAssignments",
        labelKey: "common:nav.items.trainingAssignments",
        icon: MdAssignment,
        path: "/training-assignments",
        allowedRoles: ["SwimmingCoach", "FitnessCoach"],
      },
      {
        key: "trainingSessions",
        labelKey: "common:nav.items.trainingSessions",
        icon: MdEvent,
        path: "/training-sessions",
        allowedRoles: ["SwimmingCoach", "FitnessCoach"],
      },
      {
        key: "swimming",
        labelKey: "common:nav.items.swimming",
        icon: MdPool,
        path: "/swimming",
        allowedRoles: ["SwimmingCoach"],
      },
      {
        key: "fitness",
        labelKey: "common:nav.items.fitness",
        icon: MdFitnessCenter,
        path: "/fitness",
        allowedRoles: ["FitnessCoach"],
      },

      {
        key: "nutrition",
        labelKey: "common:nav.items.nutrition",
        icon: MdRestaurant,
        path: "/nutrition",
        allowedRoles: ["NutritionSpecialist"],
      },
    ],
  },
  {
    groupKey: "operations",
    labelKey: "common:nav.groups.operations",
    items: [
      {
        key: "coachNotes",
        labelKey: "common:nav.items.coachNotes",
        icon: MdStickyNote2,
        path: "/coach-notes",
        allowedRoles: ["FitnessCoach", "SwimmingCoach"],
      },
      {
        key: "aiRecommendations",
        labelKey: "common:nav.items.aiRecommendations",
        icon: MdAutoAwesome,
        path: "/ai-recommendations",
        badge: 12,
        allowedRoles: ["NutritionSpecialist", "FitnessCoach", "SwimmingCoach"],
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
        allowedRoles: ["Admin"],
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
        allowedRoles: ["Admin"],
      },
    ],
  },
  // {
  //   groupKey: "system",
  //   labelKey: "common:nav.groups.system",
  //   items: [
  //     {
  //       key: "settings",
  //       labelKey: "common:nav.items.settings",
  //       icon: MdSettings,
  //       path: "/settings",
  //     },
  //   ],
  // },
];
