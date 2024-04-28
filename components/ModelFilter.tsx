"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useSearchParams, useRouter } from "next/navigation"
import type { Option } from '@/components/Filters'
import { Command as CommandPrimitive } from "cmdk";

export type ModelOption = {
  make: string
  model: string
  count: number
}

type MultiSelectProps = {
  options: Option[]
  modelFilter: string[]
}

export function ModelFilter({ 
  options,
  modelFilter
}:  MultiSelectProps) {

  const router = useRouter()
  const resultsPage = '/motorcycles-for-sale'
  const searchParams = useSearchParams()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const currSearch = new URLSearchParams(searchParams)

  const handleSelect = (option: Option) => {

    setInputValue("")
    inputRef?.current?.blur()
    setOpen(false)

    currSearch.set('page', '1')
    currSearch.append('model', option.value)

    router.push(`${resultsPage}?${currSearch.toString()}`);

  }


  const handleUnselect = (model: String) => {
  
    currSearch.set('page', '1')
    currSearch.delete('model', modelFilter.find(m => m === model))
    const newModelFilter = currSearch.getAll('model').filter(m => m !== model)
    currSearch.delete('model')
    newModelFilter.forEach((m) => {
    currSearch.append('model', m)
    })

    router.push(`${resultsPage}?${currSearch.toString()}`);

  }

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {

          const lastElem = modelFilter[modelFilter.length - 1]

          currSearch.set('page', '1')
          const newModelFilter = currSearch.getAll('model').filter(m => m !== lastElem)
          currSearch.delete('model')
          newModelFilter.forEach((m) => {
          currSearch.append('model', m)
          })

          router.push(`${resultsPage}?${currSearch.toString()}`);
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }

  const selectables = options.filter(option => !modelFilter.includes(option.value));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <div className="flex gap-1 flex-wrap">
          {modelFilter.map((option) => {
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
            placeholder={`Select models`}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ?
          <div className="absolute z-10 top-0 w-full h-72 rounded-md border bg-popover text-left text-popover-foreground shadow-md outline-none animate-in">
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
          </div>
          : null}
      </div>
    </Command >
  )
}