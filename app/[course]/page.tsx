import { courses } from "@/components/course-routing"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function Page({ params }: { params: { course: string } }) {
  const { course: courseId } = params
  const course = courses.find((c) => c.course === courseId)

  return (
    <div className="min-h-screen">
      <div className="mt-4">
        {course?.tools.map((tool) => (
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

export function generateStaticParams() {
  return courses.map((course) => ({
    course: course.course,
  }))
}
