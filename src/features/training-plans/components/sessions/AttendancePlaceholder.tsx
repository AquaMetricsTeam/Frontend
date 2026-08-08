import { MdFactCheck } from "react-icons/md";
import Box from "@/components/layouts/Box";

export function AttendancePlaceholder() {
  return (
    <Box>
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
          <MdFactCheck className="size-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Attendance Tracker
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Track athlete attendance and log workout completions for scheduled
            training sessions.
          </p>
        </div>
      </div>
    </Box>
  );
}
