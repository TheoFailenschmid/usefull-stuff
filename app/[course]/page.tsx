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
  params: Promise<{ course: string }>
}) {
  const { course: courseId } = use(params)
  const course = courses.find((c) => c.course === courseId)

  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="mt-4">
        {course?.tools
          .filter((tool) =>
            tool.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((tool) => (
            <Link key={tool.id} href={`/${course.course}/${tool.id}`}>
              <Card className="mb-4 cursor-pointer">
                <CardHeader>
                  <CardAction>
                    <Badge>{course.course}</Badge>
                  </CardAction>
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  )
}
