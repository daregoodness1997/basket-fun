// components/SkeletonTable.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
    columns: number; // Number of columns in the table
    rows?: number; // Number of rows to render (default is 5)
}

export default function SkeletonTable({
    columns,
    rows = 5,
}: SkeletonTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <TableHead key={colIndex}>
                            <Skeleton className="w-20 h-6 sm:w-32" />{" "}
                            {/* Placeholder for header */}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <TableCell key={colIndex}>
                                <Skeleton className="h-12 w-full" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
