import { cn } from "@/lib/utils";

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr
      className={cn("border-b transition-colors hover:bg-muted/50", className)}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return <td className={cn("p-2", className)}>{children}</td>;
}
