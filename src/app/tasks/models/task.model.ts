export interface Task {
  id: number;
  title: string;
  description: string;
  priority: number; // 1 to 5
  dueDate: string;  // ISO string
  completed: boolean;
  userEmail: string; // <-- link to logged-in user
}
