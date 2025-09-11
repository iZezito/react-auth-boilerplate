import React from "react";
import { Loader } from "./ui/loader";

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
    return <div className="text-center">{noContent}</div>;
  }

  return <>{children}</>;
};

export default ContentLoader;
