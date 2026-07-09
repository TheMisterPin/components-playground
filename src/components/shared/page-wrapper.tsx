export default function PageWrapper(props: BasePageProps) {
  const { children } = props;
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto border gradient-primary">
        <div className="flex min-h-full items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}