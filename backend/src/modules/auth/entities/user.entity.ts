export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  student_id?: string;
  phone?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'storage_staff';
  status: 'active' | 'suspended' | 'pending_verify';
  training_points: number;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export type UserPublic = Omit<User, 'password_hash'>;
