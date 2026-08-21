import { cn } from '../../utils/cn.js';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function AdminTable({
  columns,
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription,
  onRowClick,
  getRowKey = (row, index) => row._id || row.id || index,
  className,
}) {
  if (loading) {
    return (
      <div className={cn('border border-steel/20 bg-carbon/40', className)}>
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  return (
    <div className={cn('overflow-x-auto border border-steel/20 bg-carbon/40', className)}>
      <table className="min-w-full divide-y divide-steel/15">
        <thead className="bg-obsidian/60">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'px-4 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-steel',
                  column.headerClassName
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-steel/10">
          {data.map((row, rowIndex) => (
            <tr
              key={getRowKey(row, rowIndex)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'transition-colors',
                onRowClick && 'cursor-pointer hover:bg-signal/5'
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn('px-4 py-3 text-sm text-bone/90', column.cellClassName)}
                >
                  {column.render ? column.render(row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
