interface LoadingSkeletonProps {
  type: 'event' | 'news';
  count?: number;
}

export default function LoadingSkeleton({ type, count = 6 }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div key={i} className="card">
      <div className={`skeleton ${type === 'event' ? 'h-48' : 'h-32'}`}></div>
      <div className="card-content">
        <div className="skeleton h-6 mb-2"></div>
        <div className="skeleton h-4 mb-4"></div>
        <div className="skeleton h-4"></div>
      </div>
    </div>
  ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons}
    </div>
  );
} 