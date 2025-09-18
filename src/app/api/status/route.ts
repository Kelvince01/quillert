// Comprehensive status endpoint

import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

interface StatusCheck {
    name: string
    status: 'healthy' | 'unhealthy' | 'unknown'
    responseTime: number
    error?: string
  }
  
  export async function GET() {
    const startTime = Date.now()
    const checks: StatusCheck[] = []
  
    // Database check
    const dbStart = Date.now()
    try {
      const { error } = await supabase.from('users').select('count').limit(1)
      checks.push({
        name: 'database',
        status: error ? 'unhealthy' : 'healthy',
        responseTime: Date.now() - dbStart,
        error: error?.message
      })
    } catch (error) {
      checks.push({
        name: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - dbStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  
    // Auth check
    const authStart = Date.now()
    try {
      const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
      checks.push({
        name: 'auth',
        status: error ? 'unhealthy' : 'healthy',
        responseTime: Date.now() - authStart,
        error: error?.message
      })
    } catch (error) {
      checks.push({
        name: 'auth',
        status: 'unhealthy',
        responseTime: Date.now() - authStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  
    // Overall status
    const overallStatus = checks.every(check => check.status === 'healthy') ? 'healthy' : 'unhealthy'
    const totalTime = Date.now() - startTime
  
    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      totalResponseTime: totalTime,
      checks,
      metadata: {
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        uptime: process.uptime()
      }
    }
  
    return Response.json(response, {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }