import coursesData from './courseData';
import type { CourseWithPath } from '~/types/course';

interface CoursesReturn {
  courses: CourseWithPath[];
}

export const useCourses = (): CoursesReturn => {
  const courses: CourseWithPath[] = coursesData.map((item) => ({
    ...item,
    rating: item.rating.toFixed(1), // 5 -> 5.0
    reviewsCount: item.reviewsCount.toLocaleString(), // 1000 -> 1,000
    studentCount: item.studentCount.toLocaleString(), // 12345 -> 12,345
    path: `/course/${item.courseSlug}`,
  }));
  return {
    courses,
  };
};
