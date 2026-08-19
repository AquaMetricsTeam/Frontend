export const InjuryBodyPart = {
  Shoulder: 1,
  Elbow: 2,
  Wrist: 3,
  UpperBack: 4,
  LowerBack: 5,
  Neck: 6,
  Chest: 7,
  Abdomen: 8,
  Hip: 9,
  Groin: 10,
  Quadriceps: 11,
  Hamstring: 12,
  Calf: 13,
  Knee: 14,
  Ankle: 15,
  Foot: 16,
  Other: 99,
} as const;

export type InjuryBodyPart =
  (typeof InjuryBodyPart)[keyof typeof InjuryBodyPart];

export const InjuryType = {
  MuscleStrain: 1,
  MuscleTear: 2,
  TendonInjury: 3,
  LigamentInjury: 4,
  JointInjury: 5,
  Sprain: 6,
  OveruseInjury: 7,
  Cramp: 8,
  Contusion: 9,
  Dislocation: 10,
  Fracture: 11,
  Other: 99,
} as const;

export type InjuryType = (typeof InjuryType)[keyof typeof InjuryType];

export const INJURY_BODY_PART_OPTIONS = [
  {
    value: InjuryBodyPart.Shoulder,
    labelKey: "injury.bodyPart.shoulder",
    defaultLabel: "Shoulder",
  },
  {
    value: InjuryBodyPart.Elbow,
    labelKey: "injury.bodyPart.elbow",
    defaultLabel: "Elbow",
  },
  {
    value: InjuryBodyPart.Wrist,
    labelKey: "injury.bodyPart.wrist",
    defaultLabel: "Wrist",
  },
  {
    value: InjuryBodyPart.UpperBack,
    labelKey: "injury.bodyPart.upperBack",
    defaultLabel: "Upper Back",
  },
  {
    value: InjuryBodyPart.LowerBack,
    labelKey: "injury.bodyPart.lowerBack",
    defaultLabel: "Lower Back",
  },
  {
    value: InjuryBodyPart.Neck,
    labelKey: "injury.bodyPart.neck",
    defaultLabel: "Neck",
  },
  {
    value: InjuryBodyPart.Chest,
    labelKey: "injury.bodyPart.chest",
    defaultLabel: "Chest",
  },
  {
    value: InjuryBodyPart.Abdomen,
    labelKey: "injury.bodyPart.abdomen",
    defaultLabel: "Abdomen",
  },
  {
    value: InjuryBodyPart.Hip,
    labelKey: "injury.bodyPart.hip",
    defaultLabel: "Hip",
  },
  {
    value: InjuryBodyPart.Groin,
    labelKey: "injury.bodyPart.groin",
    defaultLabel: "Groin",
  },
  {
    value: InjuryBodyPart.Quadriceps,
    labelKey: "injury.bodyPart.quadriceps",
    defaultLabel: "Quadriceps",
  },
  {
    value: InjuryBodyPart.Hamstring,
    labelKey: "injury.bodyPart.hamstring",
    defaultLabel: "Hamstring",
  },
  {
    value: InjuryBodyPart.Calf,
    labelKey: "injury.bodyPart.calf",
    defaultLabel: "Calf",
  },
  {
    value: InjuryBodyPart.Knee,
    labelKey: "injury.bodyPart.knee",
    defaultLabel: "Knee",
  },
  {
    value: InjuryBodyPart.Ankle,
    labelKey: "injury.bodyPart.ankle",
    defaultLabel: "Ankle",
  },
  {
    value: InjuryBodyPart.Foot,
    labelKey: "injury.bodyPart.foot",
    defaultLabel: "Foot",
  },
  {
    value: InjuryBodyPart.Other,
    labelKey: "injury.bodyPart.other",
    defaultLabel: "Other",
  },
];

export const INJURY_TYPE_OPTIONS = [
  {
    value: InjuryType.MuscleStrain,
    labelKey: "injury.type.muscleStrain",
    defaultLabel: "Muscle Strain",
  },
  {
    value: InjuryType.MuscleTear,
    labelKey: "injury.type.muscleTear",
    defaultLabel: "Muscle Tear",
  },
  {
    value: InjuryType.TendonInjury,
    labelKey: "injury.type.tendonInjury",
    defaultLabel: "Tendon Injury",
  },
  {
    value: InjuryType.LigamentInjury,
    labelKey: "injury.type.ligamentInjury",
    defaultLabel: "Ligament Injury",
  },
  {
    value: InjuryType.JointInjury,
    labelKey: "injury.type.jointInjury",
    defaultLabel: "Joint Injury",
  },
  {
    value: InjuryType.Sprain,
    labelKey: "injury.type.sprain",
    defaultLabel: "Sprain",
  },
  {
    value: InjuryType.OveruseInjury,
    labelKey: "injury.type.overuseInjury",
    defaultLabel: "Overuse Injury",
  },
  {
    value: InjuryType.Cramp,
    labelKey: "injury.type.cramp",
    defaultLabel: "Cramp",
  },
  {
    value: InjuryType.Contusion,
    labelKey: "injury.type.contusion",
    defaultLabel: "Contusion",
  },
  {
    value: InjuryType.Dislocation,
    labelKey: "injury.type.dislocation",
    defaultLabel: "Dislocation",
  },
  {
    value: InjuryType.Fracture,
    labelKey: "injury.type.fracture",
    defaultLabel: "Fracture",
  },
  {
    value: InjuryType.Other,
    labelKey: "injury.type.other",
    defaultLabel: "Other",
  },
];

export function getInjuryBodyPartLabel(
  part: number | null | undefined,
  t: (key: string, options?: any) => string,
): string {
  if (part == null) return "";
  const opt = INJURY_BODY_PART_OPTIONS.find((o) => o.value === part);
  return opt ? t(opt.labelKey, { defaultValue: opt.defaultLabel }) : String(part);
}

export function getInjuryTypeLabel(
  type: number | null | undefined,
  t: (key: string, options?: any) => string,
): string {
  if (type == null) return "";
  const opt = INJURY_TYPE_OPTIONS.find((o) => o.value === type);
  return opt ? t(opt.labelKey, { defaultValue: opt.defaultLabel }) : String(type);
}
