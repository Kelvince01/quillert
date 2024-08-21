import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    value: Option[];
    onChange: (value: Option[]) => void;
    placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select items...'
}) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (option: Option) => {
        const isSelected = value.some((item) => item.value === option.value);
        if (isSelected) {
            onChange(value.filter((item) => item.value !== option.value));
        } else {
            onChange([...value, option]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value.length > 0 ? `${value.length} selected` : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem key={option.value} onSelect={() => handleSelect(option)}>
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        value.some((item) => item.value === option.value)
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default MultiSelect;
