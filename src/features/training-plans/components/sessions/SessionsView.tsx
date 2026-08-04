import { useState } from "react";
import {
  MdAdd,
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdFactCheck,
} from "react-icons/md";
import Box from "@/components/layouts/Box";
import WithPagination from "@/components/HOCs/WithPagination";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTrainingSessions } from "../../hooks/useTrainingSessions";
import { CreateSessionSheet } from "./CreateSessionSheet";
import { SessionDetailSheet } from "./SessionDetailSheet";
import type { TrainingSession } from "../../types/index";

export function SessionsView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<TrainingSession | null>(null);

  const { data, isLoading, isError, refetch } = useTrainingSessions({
    pageNumber: 1,
    pageSize: 10,
  });

  const sessions = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <>
      <Box>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Scheduled Sessions
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily sessions generated from active training plans
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-1.5"
          >
            <MdAdd className="size-4" />
            New Session
          </Button>
        </div>

        <WithPagination pageCount={totalPages}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableLoadingAndError
                isLoading={isLoading}
                isError={isError}
                hasNoData={sessions.length === 0}
                skeletonProps={{ columns: 5, rows: 5 }}
                errorMessageProps={{ onRetry: refetch }}
              >
                {sessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className="hover:bg-accent/40 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {session.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {session.trainingPlanTitle}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground gap-0.5">
                        <span className="flex items-center gap-1">
                          <MdCalendarToday className="size-3" />
                          {session.sessionDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MdAccessTime className="size-3" />
                          {session.startTime} - {session.endTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MdLocationOn className="size-3.5" />
                        {session.location}
                      </span>
                    </TableCell>
                    <TableCell className="text-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSession(session)}
                        className="gap-1.5 text-xs h-8 cursor-pointer"
                      >
                        <MdFactCheck className="size-3.5 text-primary" />
                        Attendance & Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableLoadingAndError>
            </TableBody>
          </Table>
        </WithPagination>
      </Box>

      <CreateSessionSheet open={createOpen} onOpenChange={setCreateOpen} />
      <SessionDetailSheet
        session={selectedSession}
        open={selectedSession !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSession(null);
        }}
      />
    </>
  );
}
