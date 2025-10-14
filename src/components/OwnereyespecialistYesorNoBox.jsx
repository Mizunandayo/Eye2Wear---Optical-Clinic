
//AI CODE//AI CODE
//AI CODE
//AI CODE
//AI CODE
//AI CODE

"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const genderOptions = [
  { value: "Optometrist", label: "Optometrist", clinic: "Ambher Optical" },
  { value: "Ophthalmologist", label: "Ophthalmologist", clinic: "Bautista Eye Center" },
  { value: "No", label: "No", clinic: "both" },
]

export function OwnereyespecialistYesorNoBox({ value, onChange, clinic }) {
  const [open, setOpen] = React.useState(false)

  // Filter options based on clinic
  const filteredOptions = React.useMemo(() => {
    if (!clinic) return [];
    
    return genderOptions.filter(option => 
      option.clinic === "both" || option.clinic === clinic
    );
  }, [clinic]);

  const handleSelect = (currentValue) => {
    const newValue = currentValue === value ? "" : currentValue
    onChange({
      target: {
        name: "owneriseyespecialist",
        value: newValue
      }
    })
    setOpen(false)
  }

  // Don't render if no clinic is selected
  if (!clinic) {
    return (
      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center">
        Please select a clinic first
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="w-[190px] justify-between !bg-[#2d2d44] text-white"
          role="combobox"
          aria-expanded={open}
        >
          {value || ""}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 !bg-[#2d2d44] text-white rounded-3xl">
        <Command>
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={handleSelect}
                className="font-semibold text-1xl"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}