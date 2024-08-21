'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Tag } from '@/lib/blog.d';
import React from 'react';

export const columns: ColumnDef<Tag>[] = [
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
        accessorKey: 'name',
        header: 'NAME'
    },
    {
        accessorKey: 'description',
        header: 'DESCRIPTION',
        enableSorting: false,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {
                        <Tooltip>
                            <TooltipTrigger>
                                <div>
                                    {String(row.getValue('description')).slice(0, 50).concat('...')}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{row.getValue('description')}</p>
                            </TooltipContent>
                        </Tooltip>
                    }
                </div>
            );
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
];
