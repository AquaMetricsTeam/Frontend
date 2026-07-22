import type { ReactNode } from "react";
import ErrorMessage, {
  type ErrorMessageProps,
} from "@/components/feedbacks/ErrorMessage";
import NoData, { type NoDataProps } from "@/components/feedbacks/NoData";
import Spinner from "@/components/feedbacks/Spinner";

interface WithLoadingAndErrorProps {
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  hasNoData?: boolean;
  errorMessageProps?: ErrorMessageProps;
  noDataMessageProps?: NoDataProps;
  loadingComponent?: ReactNode;
}

const WithLoadingAndError = ({
  children,
  isLoading,
  isError,
  hasNoData,
  errorMessageProps,
  noDataMessageProps,
  loadingComponent = (
    <div className="flex size-full flex-1 items-center justify-center">
      <Spinner />
    </div>
  ),
}: WithLoadingAndErrorProps) => {
  if (isLoading) return loadingComponent;
  else if (isError) return <ErrorMessage {...errorMessageProps} />;
  else if (hasNoData) return <NoData {...noDataMessageProps} />;
  return children;
};

export default WithLoadingAndError;
