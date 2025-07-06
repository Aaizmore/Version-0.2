"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, GraduationCap, Shield } from "lucide-react"
import Image from "next/image"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const ensureUserProfile = async (user: any) => {
    try {
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

      if (!existingProfile) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
      }
    } catch (error) {
      console.error("Profile creation error:", error)
    }
  }

  const handleSignUp = async (formData: FormData) => {
    setIsLoading(true)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast({
        title: "Registration Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      if (data.user && !data.session) {
        setUserEmail(email)
        setShowEmailSent(true)
        toast({
          title: "Verification Required",
          description: "Please check your email to verify your account and complete registration.",
        })
      } else if (data.session && data.user) {
        await ensureUserProfile(data.user)
        toast({
          title: "Welcome to Lakambini XI Archives",
          description: "Your account has been created successfully.",
        })
        router.push("/")
        router.refresh()
      }
    }
    setIsLoading(false)
  }

  const handleSignIn = async (formData: FormData) => {
    setIsLoading(true)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      })
    } else if (data.user) {
      await ensureUserProfile(data.user)
      toast({
        title: "Welcome Back",
        description: "Successfully signed in to your account.",
      })
      router.push("/")
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleResendConfirmation = async () => {
    if (!userEmail) return

    setIsLoading(true)
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: userEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Email Sent",
        description: "A new verification email has been sent to your inbox.",
      })
    }
    setIsLoading(false)
  }

  if (showEmailSent) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md glass-morphism">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-royal-100 to-gold-100">
              <Mail className="h-8 w-8 text-royal-600" />
            </div>
            <CardTitle className="font-serif text-2xl text-gradient">Verify Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent a verification link to <strong className="text-royal-700">{userEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-royal-200 bg-royal-50">
              <CheckCircle className="h-4 w-4 text-royal-600" />
              <AlertDescription className="text-royal-700">
                Click the verification link in your email to activate your account and access the archives.
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or request a new verification link.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={handleResendConfirmation}
                  disabled={isLoading}
                  className="border-royal-200 text-royal-700 hover:bg-royal-50 bg-transparent"
                >
                  {isLoading ? "Sending..." : "Resend Verification Email"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowEmailSent(false)
                    setUserEmail("")
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Back to Registration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12">
      <Card className="w-full max-w-md glass-morphism">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/lakambini-badge.png"
              alt="Lakambini XI Badge"
              width={80}
              height={80}
              className="rounded-full ring-4 ring-white/50 shadow-lg"
            />
          </div>
          <CardTitle className="font-serif text-2xl text-gradient">Access Archives</CardTitle>
          <CardDescription className="text-base">
            Sign in to your account or create a new one to contribute to our digital heritage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-royal-50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:text-royal-700">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-royal-700">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form action={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="border-gray-200 focus:border-royal-400 focus:ring-royal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="border-gray-200 focus:border-royal-400 focus:ring-royal-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-royal-600 to-gold-500 hover:from-royal-700 hover:to-gold-600 text-white font-medium"
                  disabled={isLoading}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form action={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className="border-gray-200 focus:border-royal-400 focus:ring-royal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="border-gray-200 focus:border-royal-400 focus:ring-royal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Create a secure password (min. 6 characters)"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="border-gray-200 focus:border-royal-400 focus:ring-royal-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-royal-600 to-gold-500 hover:from-royal-700 hover:to-gold-600 text-white font-medium"
                  disabled={isLoading}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
