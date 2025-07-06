"use client"

import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  title: string
  text: string
  url?: string
  iconOnly?: boolean
  className?: string
}

export function ShareButton({ title, text, url, iconOnly, className }: ShareButtonProps) {
  const [currentUrl, setCurrentUrl] = useState("")
  const [canShare, setCanShare] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setCurrentUrl(url || window.location.href)
    setCanShare(typeof navigator !== "undefined" && "share" in navigator)
  }, [url])

  const handleShare = async () => {
    const shareUrl = currentUrl || window.location.href

    if (canShare) {
      try {
        await navigator.share({ title, text, url: shareUrl })
      } catch (error) {
        // User cancelled or error occurred, fallback to copy
        handleCopyToClipboard(shareUrl)
      }
    } else {
      handleCopyToClipboard(shareUrl)
    }
  }

  const handleCopyToClipboard = async (urlToCopy: string) => {
    try {
      await navigator.clipboard.writeText(urlToCopy)
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      })
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = urlToCopy
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      })
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className={className} title="Share">
      {canShare ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {!iconOnly && <span className="ml-2">{canShare ? "Share" : "Copy Link"}</span>}
    </Button>
  )
}
