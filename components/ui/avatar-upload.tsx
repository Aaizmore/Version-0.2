"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface AvatarUploadProps {
  currentUrl?: string | null
  userName?: string | null
  onSelect: (file: File) => void
}

export function AvatarUpload({ currentUrl, userName, onSelect }: AvatarUploadProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const initials =
    userName
      ?.split(" ")
      .map((part: string) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"

  const chooseFile = () => fileInput.current?.click()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      onSelect(file)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <Avatar className="h-28 w-28 ring-2 ring-gold-200">
          <AvatarImage src={preview || currentUrl || "/placeholder.svg"} alt={userName ?? "Avatar"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={chooseFile}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition hover:opacity-100"
        >
          <Camera className="h-6 w-6 text-white" />
        </button>
      </div>

      <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleChange} />

      <Button variant="outline" size="sm" onClick={chooseFile}>
        Change Avatar
      </Button>
    </div>
  )
}
