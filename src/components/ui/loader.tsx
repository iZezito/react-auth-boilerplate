export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-10 w-10" />
      <p className="mt-4">Carregando...</p>
    </div>
  );
};
