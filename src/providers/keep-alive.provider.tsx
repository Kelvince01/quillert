import { useSupabaseKeepAlive } from "@/hooks/use-supabase-keep-alive"

export function KeepAliveProvider({ children }: { children: React.ReactNode }) {
    useSupabaseKeepAlive(15) // Ping every 15 minutes
    return <>{children}</>
  }