// This file only contains some HTTP status codes.

// 2xx //

export const STATUS_OK         = "OK"         as const; // 200 OK
export const STATUS_CREATED    = "CREATED"    as const; // 201 Created
export const STATUS_NO_CONTENT = "NO_CONTENT" as const; // 204 No Content

// 4xx //

export const STATUS_BAD_REQUEST = "BAD_REQUEST" as const; // 400 Bad Request
export const STATUS_FORBIDDEN   = "FORBIDDEN"   as const; // 403 Forbidden
export const STATUS_NOT_FOUND   = "NOT_FOUND"   as const; // 404 Not Found

// 5xx //

export const STATUS_INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR" as const; // 500 Internal Server Error
