'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Comment } from '@/lib/blog.d';
import React from 'react';

const getSeverity = (status: boolean) => {
    if (status) {
        return 'outline';
    } else {
        return 'destructive';
    }
};

export const columns: ColumnDef<Comment>[] = [
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
        accessorKey: 'posts.title',
        header: 'POST'
    },
    {
        accessorKey: 'content',
        header: 'CONTENT',
        enableSorting: false,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {
                        <Tooltip>
                            <TooltipTrigger>
                                <div>
                                    {/*{String(row.getValue('content')).slice(0, 50).concat('...')}*/}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: String(row.getValue('content'))
                                                .slice(0, 50)
                                                .concat('...')
                                        }}
                                    ></span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: row.getValue('content')
                                        }}
                                    ></span>
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    }
                </div>
            );
        }
    },
    {
        accessorKey: 'approved',
        header: 'APPROVED',
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {
                        <Badge variant={getSeverity(row.getValue('approved'))}>
                            {row.getValue('approved') == true ? 'True' : 'False'}
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
