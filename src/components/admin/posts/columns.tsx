'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Post } from '@/lib/blog.d';

const getSeverity = (status: string) => {
    if (status == 'publish' || 'future' || 'draft' || 'pending') {
        return 'outline';
    } else {
        return 'destructive';
    }
};

export const columns: ColumnDef<Post>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'title',
        header: 'TITLE'
    },
    {
        accessorKey: 'views',
        header: 'VIEWS',
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'excerpt',
        header: 'EXCERPT',
        enableSorting: false,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {
                        <Tooltip>
                            <TooltipTrigger>
                                <div>
                                    {String(row.getValue('excerpt')).slice(0, 50).concat('...')}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{row.getValue('excerpt')}</p>
                            </TooltipContent>
                        </Tooltip>
                    }
                </div>
            );
        }
    },
    {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {
                        <Badge variant={getSeverity(row.getValue('status'))}>
                            {row.getValue('status')}
                        </Badge>
                    }
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: 'created_at',
        header: 'CREATED AT',
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {new Date(row.getValue('created_at')).toDateString()}
                </div>
            );
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
];
