# Assign Athletes to Group

## Endpoint

```
POST /api/groups/{groupId}/athletes
```

## Description

Assigns one or multiple athletes to a specific group. This endpoint supports bulk assignment and handles re-activation of previously archived memberships.

## Authentication & Authorization

- **Authentication**: Bearer token required
- **Authorized Roles**: `SwimmingCoach`, `FitnessCoach`, `NutritionSpecialist`

The authenticated coach must be the owner of the group within their domain scope.

## Request

### Path Parameters

| Name    | Type | Description                               |
| ------- | ---- | ----------------------------------------- |
| groupId | int  | The unique identifier of the target group |

### Request Body

| Field      | Type       | Required | Validation Rules                                                            |
| ---------- | ---------- | -------- | --------------------------------------------------------------------------- |
| AthleteIds | List<Guid> | Yes      | List of athlete IDs to assign. Can be empty list but field must be present. |

**Example Request:**

```json
{
  "athleteIds": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "7b9f2c3d-8e4a-4f1b-9a5d-6c8e3b2a1f4e"
  ]
}
```

## Response

### Success Response

- **Status Code**: `200 OK`

### Response Body Structure

| Field      | Type          | Description                                   |
| ---------- | ------------- | --------------------------------------------- |
| success    | bool          | Indicates if the operation succeeded          |
| message    | string        | Human-readable success message                |
| data       | bool          | Returns `true` when athletes are assigned     |
| statusCode | int?          | HTTP status code (null for success responses) |
| errors     | List<string>? | List of error messages (null for success)     |

**Example Success Response:**

```json
{
  "success": true,
  "message": "Athletes assigned successfully.",
  "data": true,
  "statusCode": null,
  "errors": null
}
```

## Error Responses

| Status Code | Scenario                                             | Example Response Body         |
| ----------- | ---------------------------------------------------- | ----------------------------- |
| 400         | Athlete is not assigned to the requesting coach      | See example below             |
| 400         | Athlete already belongs to another active group      | See example below             |
| 401         | Missing or invalid authentication token              | Standard authentication error |
| 403         | User does not have the required role                 | Standard authorization error  |
| 404         | Group with the specified ID does not exist           | See example below             |
| 404         | Group does not belong to the requesting coach/domain | See example below             |

**Example 404 Error Response (Group Not Found):**

```json
{
  "success": false,
  "message": "Group with ID 123 was not found.",
  "data": null,
  "statusCode": 404,
  "errors": null
}
```

**Example 400 Error Response (Athlete Not Assigned to Coach):**

```json
{
  "success": false,
  "message": "Athlete 3fa85f64-5717-4562-b3fc-2c963f66afa6 is not assigned to this coach.",
  "data": null,
  "statusCode": 400,
  "errors": null
}
```

**Example 400 Error Response (Athlete in Another Group):**

```json
{
  "success": false,
  "message": "Athlete 7b9f2c3d-8e4a-4f1b-9a5d-6c8e3b2a1f4e already belongs to another active group.",
  "data": null,
  "statusCode": 400,
  "errors": null
}
```

## Notes

### Business Rules

1. **Bulk Assignment**: Multiple athletes can be assigned in a single API call by providing multiple GUIDs in the `athleteIds` array.

2. **Coach Assignment Verification**: Each athlete must be pre-assigned to the requesting coach before they can be added to the coach's group. The endpoint validates this relationship.

3. **Single Active Group**: An athlete can only belong to one active group at a time within a domain. Attempting to assign an athlete who is already in a different active group will result in a 400 error.

4. **Re-activation of Archived Memberships**: If an athlete was previously in the group but their membership was archived (removed), this endpoint will re-activate the membership instead of creating a duplicate record. The `joinedAt` date will be updated to the current date.

5. **Idempotent for Existing Members**: If an athlete is already an active member of the target group, the request will succeed without error (the membership is left unchanged).

6. **Domain Scoping**: All operations are scoped to the authenticated coach's domain. A coach can only assign athletes to groups within their own domain.

7. **Atomic Validation**: If any athlete in the request fails validation (not assigned to coach, in another group, etc.), the entire operation fails and no athletes are assigned.

### Frontend Implementation Tips

- The endpoint processes athletes sequentially. Consider showing progress for large batch assignments.
- Handle partial failures gracefully—if the request fails on athlete #3 of 5, athletes #1 and #2 were **not** assigned (the operation is not partially committed).
- Use the `GET /api/groups/{groupId}/athletes` endpoint to fetch the updated member list after successful assignment.
- Consider caching the coach's available athletes list from `GET /api/groups/available-athletes` to prevent assigning ineligible athletes.
