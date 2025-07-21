
export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: CourseModule[];
  price: number;
  image?: string;
  instructor?: string;
  tags?: string[];
  createdAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}
