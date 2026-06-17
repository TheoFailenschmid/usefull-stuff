import { courses } from "@/components/course-routing";

export default async function Page({
  params,
}: {
  params: Promise<{ tool: string; course: string }>
}) {
  const { tool: toolId, course: courseId } = await params
  const tool = courses
    .find((c) => c.course === courseId)
    ?.tools.find((t) => t.id === toolId)

  if (!tool) {
    return null
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

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.tools.map((tool) => ({
      course: course.course,
      tool: tool.id,
    }))
  )
}
