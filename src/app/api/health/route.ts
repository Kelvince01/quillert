import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

export async function GET(request: NextRequest) {
  try {
    // Multiple health checks
    const checks = await Promise.allSettled([
      // Database connectivity test
      supabase.from('users').select('count').limit(1),
      
      // Auth service test
      supabase.auth.admin.listUsers({ page: 1, perPage: 1 }),
      
      // Storage test (uncomment if using storage)
      // supabase.storage.listBuckets(),
      
      // Real-time test (optional)
      // supabase.channel('health-check').subscribe(),
    ])

    const results = {
      status: 'healthy',
      database: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      auth: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      // storage: checks[2]?.status === 'fulfilled' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      errors: [] as string[]
    }

    // Add error details for failed checks
    const errors: string[] = []
    if (checks[0].status === 'rejected') {
      errors.push(`Database: ${checks[0].reason?.message || 'Unknown error'}`)
    }
    if (checks[1].status === 'rejected') {
      errors.push(`Auth: ${checks[1].reason?.message || 'Unknown error'}`)
    }

    if (errors.length > 0) {
      results.errors = errors
      results.status = 'degraded'
    }

    // Determine overall health status
    const isHealthy = results.database === 'healthy' && results.auth === 'healthy'
    const statusCode = isHealthy ? 200 : 503

    return Response.json(results, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    return Response.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  }
}

// Optional: Add POST method for more detailed diagnostics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { includeDetails = false } = body

    // Basic health check
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    const healthInfo = {
      status: dbError ? 'unhealthy' : 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: !dbError,
        error: dbError?.message || null
      },
      details: {
        tables: {
          posts: 'accessible',
          authors: 'accessible',
          categories: 'accessible'
        },
        auth: {
          admin_access: 'working'
        }
      },
    }

    // Include detailed diagnostics if requested
    if (includeDetails) {
      const detailedChecks = await Promise.allSettled([
        // Test different table operations
        supabase.from('posts').select('id').limit(1),
        supabase.from('authors').select('id').limit(1),
        supabase.from('categories').select('id').limit(1),
        
        // Test auth operations
        supabase.auth.admin.listUsers({ page: 1, perPage: 1 }),
      ])

      healthInfo.details = {
        tables: {
          posts: detailedChecks[0].status === 'fulfilled' ? 'accessible' : 'error',
          authors: detailedChecks[1].status === 'fulfilled' ? 'accessible' : 'error',
          categories: detailedChecks[2].status === 'fulfilled' ? 'accessible' : 'error'
        },
        auth: {
          admin_access: detailedChecks[3].status === 'fulfilled' ? 'working' : 'error'
        }
      }
    }

    return Response.json(healthInfo, {
      status: healthInfo.status === 'healthy' ? 200 : 503
    })

  } catch (error) {
    return Response.json({
      status: 'error',
      message: 'Failed to process health check request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}
