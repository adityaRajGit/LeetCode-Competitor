# API Contracts

**Feature**: 002-competitive-dashboard  
**Last Updated**: February 15, 2026

## External API Contract

### LeetCode Stats API

**Base URL**: `https://leetcode-stats-api.herokuapp.com/`

**Authentication**: None required  
**CORS**: Enabled for browser requests  
**Rate Limiting**: Unknown (client-side 60s cooldown implemented)

---

#### GET /<username>

Fetch comprehensive statistics for a LeetCode user.

**Endpoint**: `GET https://leetcode-stats-api.herokuapp.com/{username}`

**Path Parameters**:
- `username` (string, required): LeetCode username

**Request Headers**: None required

**Request Example**:
```http
GET https://leetcode-stats-api.herokuapp.com/aditya_raj HTTP/1.1
Host: leetcode-stats-api.herokuapp.com
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "retrieved",
  "totalSolved": 231,
  "totalQuestions": 3845,
  "easySolved": 124,
  "totalEasy": 927,
  "mediumSolved": 97,
  "totalMedium": 2009,
  "hardSolved": 10,
  "totalHard": 909,
  "acceptanceRate": 61.09,
  "ranking": 613761,
  "contributionPoints": 687,
  "reputation": 3,
  "submissionCalendar": {
    "1739836800": 2,
    "1744588800": 1,
    "1752364800": 1,
    "1755216000": 5,
    "1761436800": 7
  }
}
```

**Response Schema**:
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `status` | string | Request status ("success" or "error") | Yes |
| `message` | string | Human-readable message | No |
| `totalSolved` | number | Total problems solved across all difficulties | Yes |
| `totalQuestions` | number | Total problems available on LeetCode | Yes |
| `easySolved` | number | Easy problems solved | Yes |
| `totalEasy` | number | Total easy problems available | Yes |
| `mediumSolved` | number | Medium problems solved | Yes |
| `totalMedium` | number | Total medium problems available | Yes |
| `hardSolved` | number | Hard problems solved | Yes |
| `totalHard` | number | Total hard problems available | Yes |
| `acceptanceRate` | number | Acceptance rate percentage (0-100) | Yes |
| `ranking` | number | Global LeetCode rank | Yes |
| `contributionPoints` | number | LeetCode contribution score | Yes |
| `reputation` | number | LeetCode reputation score | Yes |
| `submissionCalendar` | object | Map of Unix timestamp (string) to submission count (number) | Yes |

**submissionCalendar Format**:
```typescript
{
  "1739836800": 2,  // Unix timestamp (seconds) → submission count
  "1744588800": 1,
  ...
}
```
- **Keys**: Unix timestamps in seconds (as strings)
- **Values**: Number of problem submissions on that date
- **Sparse**: Only dates with submissions are included

**Error Response (404 Not Found)**:
```json
{
  "status": "error",
  "message": "User not found"
}
```

**Error Response (429 Too Many Requests)**:
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "status": "error",
  "message": "Rate limit exceeded"
}
```

**Error Response (500+ Server Error)**:
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "status": "error",
  "message": "Service temporarily unavailable"
}
```

**Error Handling**:
```typescript
try {
  const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
  
  if (!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error('USERNAME_NOT_FOUND')
      case 429:
        throw new Error('RATE_LIMIT_EXCEEDED')
      case 500:
      case 502:
      case 503:
        throw new Error('SERVICE_UNAVAILABLE')
      default:
        throw new Error('UNKNOWN_ERROR')
    }
  }
  
  const data = await response.json()
  
  if (data.status !== 'success') {
    throw new Error('INVALID_RESPONSE')
  }
  
  return data
} catch (error) {
  // Handle network errors, CORS errors, JSON parse errors
  if (error instanceof TypeError) {
    throw new Error('NETWORK_ERROR')
  }
  throw error
}
```

**Client-Side Rate Limiting**:
```typescript
const API_RATE_LIMIT_MS = 60000  // 60 seconds

const lastFetchMap = new Map<string, number>()

function canFetch(username: string): boolean {
  const lastFetch = lastFetchMap.get(username)
  if (!lastFetch) return true
  
  const elapsed = Date.now() - lastFetch
  return elapsed >= API_RATE_LIMIT_MS
}

function recordFetch(username: string): void {
  lastFetchMap.set(username, Date.now())
}
```

**Retry Strategy**:
```typescript
async function fetchWithRetry(
  username: string,
  maxRetries: number = 3
): Promise<LeetCodeAPIResponse> {
  let lastError: Error
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchLeetCodeStats(username)
    } catch (error) {
      lastError = error
      
      // Don't retry on client errors (404, 400, etc.)
      if (error.message === 'USERNAME_NOT_FOUND') {
        throw error
      }
      
      // Exponential backoff for server errors
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000  // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}
```

---

## API Response Transformation

Transform external API response to internal data model:

```typescript
function transformAPIResponse(
  username: string,
  apiResponse: LeetCodeAPIResponse
): LeetCodeUser {
  const now = Date.now()
  
  return {
    // Identity
    username,
    
    // Problem Statistics (direct mapping)
    totalSolved: apiResponse.totalSolved,
    easySolved: apiResponse.easySolved,
    mediumSolved: apiResponse.mediumSolved,
    hardSolved: apiResponse.hardSolved,
    
    // Platform Metrics (direct mapping)
    ranking: apiResponse.ranking,
    acceptanceRate: apiResponse.acceptanceRate,
    contributionPoints: apiResponse.contributionPoints,
    reputation: apiResponse.reputation,
    
    // Submission History (direct mapping)
    submissionCalendar: apiResponse.submissionCalendar,
    
    // Derived Metrics (client-side calculation)
    currentStreak: calculateStreak(apiResponse.submissionCalendar),
    todaySolved: getTodaySolved(apiResponse.submissionCalendar),
    weeklySolved: getWeeklySolved(apiResponse.submissionCalendar),
    totalPoints: 0,  // Calculated separately with friend context
    
    // Metadata
    lastFetched: now,
    cacheExpiry: now + (5 * 60 * 1000)  // 5 minutes
  }
}
```

---

## API Contract Validation

Validate API response before processing:

```typescript
interface APIValidationResult {
  valid: boolean
  errors: string[]
}

function validateAPIResponse(data: any): APIValidationResult {
  const errors: string[] = []
  
  // Check required fields
  if (data.status !== 'success') {
    errors.push('Response status is not "success"')
  }
  
  if (typeof data.totalSolved !== 'number') {
    errors.push('totalSolved must be a number')
  }
  
  if (typeof data.easySolved !== 'number') {
    errors.push('easySolved must be a number')
  }
  
  if (typeof data.mediumSolved !== 'number') {
    errors.push('mediumSolved must be a number')
  }
  
  if (typeof data.hardSolved !== 'number') {
    errors.push('hardSolved must be a number')
  }
  
  if (typeof data.ranking !== 'number') {
    errors.push('ranking must be a number')
  }
  
  if (typeof data.submissionCalendar !== 'object') {
    errors.push('submissionCalendar must be an object')
  }
  
  // Validate submission calendar structure
  if (data.submissionCalendar) {
    for (const [key, value] of Object.entries(data.submissionCalendar)) {
      if (isNaN(Number(key))) {
        errors.push(`submissionCalendar key "${key}" is not a valid number`)
      }
      if (typeof value !== 'number') {
        errors.push(`submissionCalendar value for "${key}" is not a number`)
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

---

## CORS Requirements

**Expected CORS Headers from API**:
```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```

**If CORS Issues Arise** (fallback strategies):
1. Use CORS proxy service (https://corsproxy.io/, etc.)
2. Request API maintainer to add CORS headers
3. Implement browser extension workaround (dev mode only)

---

## Monitoring & Debugging

**API Health Check**:
```typescript
async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch('https://leetcode-stats-api.herokuapp.com/test-user', {
      method: 'HEAD',
      mode: 'no-cors'  // Just check if endpoint responds
    })
    return true
  } catch {
    return false
  }
}
```

**Request Logging** (dev mode):
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('[API] Request:', { username, timestamp: Date.now() })
  console.log('[API] Response:', response)
}
```

---

## Contract Version

**Version**: 1.0  
**Last Verified**: February 15, 2026  
**API Provider**: leetcode-stats-api.herokuapp.com (third-party)  
**Breaking Change Risk**: Medium (external API, no SLA)

**Mitigation**: 
- Monitor API response format changes
- Implement graceful degradation
- Cache last known good response
- Consider alternative API sources if primary fails
