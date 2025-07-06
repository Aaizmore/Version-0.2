import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { createClient } from "@/lib/supabase/server"
import { PenTool, GraduationCap } from "lucide-react"
import Image from "next/image"

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b border-white/20 glass-morphism sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <Image
                  src="/images/lakambini-badge.png"
                  alt="Lakambini XI Badge"
                  width={48}
                  height={48}
                  className="rounded-full ring-2 ring-gold-400/50 group-hover:ring-gold-500 transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif font-bold text-xl text-gradient">Lakambini XI</h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide">DIGITAL ARCHIVES</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hover:bg-royal-50 hover:text-royal-700 transition-all duration-300"
                >
                  <Link href="/write" className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">Compose</span>
                  </Link>
                </Button>
                <UserNav user={user} />
              </>
            ) : (
              <Button
                asChild
                className="bg-gradient-to-r from-royal-600 to-gold-500 hover:from-royal-700 hover:to-gold-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              >
                <Link href="/auth" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Access Archives
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
