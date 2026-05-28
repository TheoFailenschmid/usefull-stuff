"use client"
import { courses } from "@/components/course-routing"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { use, useState } from "react"

export default function Page({
  params,
}: {
  params: Promise<{ tool: string; course: string }>
}) {
  const { tool: toolId, course: courseId } = use(params)
  const tool = courses
    .find((c) => c.course === courseId)
    ?.tools.find((t) => t.id === toolId)

  if (!tool) {
    return
  }

  return (
    <div className="min-h-screen">
      <h2>{tool.name}</h2>
      <div className="mt-4">
        <tool.commponent />
      </div>
    </div>
  )
}
