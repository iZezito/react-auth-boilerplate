import React from "react";
import { Loader } from "./ui/loader";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { XCircle } from "lucide-react";

interface Props {
  loading: boolean;
  error: Error | null;
  noContent: string | React.ReactNode;
  loadingComponent?: React.ReactNode;
  repeat?: number;
  children?: React.ReactNode;
}

const ContentLoader: React.FC<Props> = ({
  loading,
  error,
  noContent,
  loadingComponent,
  repeat,
  children,
}) => {
  if (loading) {
    if (loadingComponent && repeat) {
      return (
        <>
          {Array.from({ length: repeat }).map((_, index) => (
            <div key={index} className="m-2">
              {loadingComponent}
            </div>
          ))}
        </>
      );
    }

    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error.message}</div>;
  }

  if (!children) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <XCircle className="h-16 w-16 text-red-500" />
          </EmptyMedia>
          <EmptyTitle>Nenhum dado encontrado!</EmptyTitle>
          <EmptyDescription>
          {noContent}
        </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <>{children}</>;
};

export default ContentLoader;
