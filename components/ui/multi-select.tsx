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
import type { FetchOptions } from '@/app/page'
import { Command as CommandPrimitive } from "cmdk";

export type Option = Record<'value' | 'label', string>;
export type Classification = 'makes' | 'models'

type MultiSelectProps = {
  options: Option[]
  classification: Classification
  optionsChangeHandler: (options: Option[], classification: Classification) => void
}

export function MultiSelect({ options, classification, optionsChangeHandler }:  MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((framework: Option) => {
    setSelected(prev => prev.filter(s => s.value !== framework.value));
  }, []);

  React.useEffect(() => {
    if (selected.length)
      console.log('effect triggered')
    
    optionsChangeHandler(selected, classification)
  }, [selected, optionsChangeHandler, classification])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected(prev => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          })
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const selectables = options.filter(framework => !selected.includes(framework));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <div className="flex gap-1 flex-wrap">
          {selected.map((framework) => {
            return (
              <Badge key={framework.value} variant="secondary">
                {framework.value}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(framework)}
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
            placeholder={`Select ${classification}`}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ?
          <ScrollArea className="absolute w-full h-72 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                
                {selectables.map((framework) => {
                  return (
                    <CommandItem
                      key={framework.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("")
                        inputRef?.current?.blur()
                        setOpen(false)
                        setSelected(prev => [...prev, framework])
                      }}
                      className={"cursor-pointer"}
                    >
                      {framework.label}
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