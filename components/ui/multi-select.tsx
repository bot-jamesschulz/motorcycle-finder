"use client";

import * as React from "react";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import type { 
  Query,
  SetQuery
} from '@/app/page'
import { Command as CommandPrimitive } from "cmdk";

export type Option = Record<'value' | 'label', string>;

type MultiSelectProps = {
  options: Option[]
  query: Query
  setQuery: SetQuery
  filterKey: keyof Query['filters']
  selected?: string[]
}

export function MultiSelect({ 
  options, 
  query,
  setQuery,
  filterKey,
  selected,
}:  MultiSelectProps) {

  
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const queryFilters = query.filters[filterKey]

  console.log(`queryFilters, ${filterKey}`, queryFilters)

  const handleUnselect = React.useCallback((option: String) => {
    setQuery((prev) => ({
      ...prev,
      pageNum: 0,
      filters: {
          ...prev.filters,
          [filterKey]: prev.filters[filterKey].filter(s => s !== option)
      }
    }))
  }, [filterKey, setQuery]);

  const handleSelect = React.useCallback((option: Option) => {
    
    setInputValue("")
    inputRef?.current?.blur()
    setOpen(false)
    setQuery((prev) => ({
      ...prev,
      pageNum: 0,
      filters: {
          ...prev.filters,
          [filterKey]: [...prev.filters[filterKey], option.value]
      }
    }))
  }, [filterKey, setQuery]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setQuery((prev) => {
            const newSelected = [...prev.filters[filterKey]]
            newSelected.pop()
            return {
              ...prev,
              pageNum: 0,
              filters: {
                ...prev.filters,
                [filterKey]: newSelected
              }
            }
          })

        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, [filterKey, setQuery]);

  const selectables = options.filter(option => !queryFilters.includes(option.value));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <div className="flex gap-1 flex-wrap">
          {queryFilters.map((option) => {
            return (
              <Badge key={option} variant="secondary">
                {option}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={`Select ${filterKey}`}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ?
          <ScrollArea className="absolute w-full h-72 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelect(option)}
                      className={"cursor-pointer"}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
                
              </CommandGroup>
          </ScrollArea>
          : null}
      </div>
    </Command >
  )
}