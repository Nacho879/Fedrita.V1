"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Check,
  Calendar as CalendarIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { format, addDays, subDays } from "date-fns"

const CALENDAR_PRESETS = [
  {
    name: "today",
    label: "Hoy",
  },
  {
    name: "yesterday",
    label: "Ayer",
  },
  {
    name: "last7",
    label: "Últimos 7 días",
  },
  {
    name: "last14",
    label: "Últimos 14 días",
  },
  {
    name: "last30",
    label: "Últimos 30 días",
  },
  {
    name: "thisMonth",
    label: "Este mes",
  },
  {
    name: "lastMonth",
    label: "Mes pasado",
  },
]

export function DateRangePicker({
  initialDateFrom,
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = "end",
  locale = "en-US",
}) {
  const [isOpen, setIsOpen] = useState(false)

  const [range, setRange] = useState({
    from: initialDateFrom ? new Date(initialDateFrom) : undefined,
    to: initialDateTo ? new Date(initialDateTo) : undefined,
  })
  
  const [rangeCompare] = useState({
    from: initialCompareFrom ? new Date(initialCompareFrom) : undefined,
    to: initialCompareTo ? new Date(initialCompareTo) : undefined,
  })

  const [selectedPreset, setSelectedPreset] = useState("custom")

  const resetButtonRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      resetButtonRef.current?.focus()
    }
  }, [isOpen])

  const getPresetRange = (presetName) => {
    const now = new Date()
    switch (presetName) {
      case "today":
        return { from: now, to: now }
      case "yesterday":
        const yesterday = subDays(now, 1)
        return { from: yesterday, to: yesterday }
      case "last7":
        return { from: subDays(now, 6), to: now }
      case "last14":
        return { from: subDays(now, 13), to: now }
      case "last30":
        return { from: subDays(now, 29), to: now }
      case "thisMonth":
        return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now }
      case "lastMonth":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        return {
          from: lastMonth,
          to: new Date(now.getFullYear(), now.getMonth(), 0),
        }
      default:
        return { from: undefined, to: undefined }
    }
  }

  const setPreset = (preset) => {
    const newRange = getPresetRange(preset)
    setRange(newRange)
    setSelectedPreset(preset)
  }

  const checkPreset = () => {
    for (const preset of CALENDAR_PRESETS) {
      const presetRange = getPresetRange(preset.name)
      if (
        range.from && presetRange.from &&
        range.to && presetRange.to &&
        format(presetRange.from, "yyyy-MM-dd") ===
          format(range.from, "yyyy-MM-dd") &&
        format(presetRange.to, "yyyy-MM-dd") === format(range.to, "yyyy-MM-dd")
      ) {
        setSelectedPreset(preset.name)
        return
      }
    }
    setSelectedPreset("custom")
  }

  const onSelect = (newRange) => {
    setRange(newRange ?? { from: undefined, to: undefined })
    checkPreset()
  }

  const applyUpdate = () => {
    setIsOpen(false)
    if (onUpdate) {
      onUpdate({ range, rangeCompare })
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !range && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range.from ? (
            range.to ? (
              <>
                {format(range.from, "LLL dd, y")} -{" "}
                {format(range.to, "LLL dd, y")}
              </>
            ) : (
              format(range.from, "LLL dd, y")
            )
          ) : (
            <span>Seleccionar fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex">
          <div className="flex flex-col">
            <div className="p-2">
              <Select
                onValueChange={(value) => setPreset(value)}
                value={selectedPreset}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent>
                  {CALENDAR_PRESETS.map((preset) => (
                    <SelectItem value={preset.name} key={preset.name}>
                      {preset.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Calendar
              mode="range"
              onSelect={onSelect}
              selected={range}
              numberOfMonths={1}
              defaultMonth={range.from}
            />
          </div>
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
          >
            Cancelar
          </Button>
          <Button onClick={applyUpdate}>
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}