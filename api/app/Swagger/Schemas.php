<?php

/** 
 * @OA\Schema(
 *     schema="Event",
 *     type="object",
 *     title="Event",
 *     required={"id", "title", "starts_at", "status"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Sample Event"),
 *     @OA\Property(property="starts_at", type="string", format="date-time", example="2025-08-23T14:00:00Z"),
 *     @OA\Property(property="status", type="string", enum={"draft", "published", "cancelled"}, example="published")
 * )
 */