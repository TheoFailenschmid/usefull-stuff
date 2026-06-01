"use client"

import { courses } from "@/components/course-routing"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TypographyMuted } from "@/components/ui/typography"
import { IconMenu } from "@tabler/icons-react"
import Link from "next/link"
import { use } from "react"

export default function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ course: string }>
}>) {
  const { course: courseId } = use(params)
  const course = courses.find((c) => c.course === courseId)

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="mx-auto flex gap-4 px-4 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <IconMenu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-max">
              {courses.map((course) => (
                <Link key={course.course} href={`/${course.course}`}>
                  <DropdownMenuItem>{course.name}</DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1">
            <h1 className="text-lg font-normal">
              <TypographyMuted>
                {course ? course.name : "Select a course"}
              </TypographyMuted>
            </h1>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 p-6">
        <div className="mx-auto max-w-7xl px-4">{children}</div>
      </main>
    </div>
  )
}
