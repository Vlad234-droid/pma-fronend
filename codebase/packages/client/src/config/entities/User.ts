import { UserprofileAttributes } from 'config/types';

enum Status {
  PENDING = 'pending',
  ACTIVE = 'active',
  LOCKED = 'locked',
}

enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export { Role, Status };

export interface Profile {
  department: string;
  fullName: string;
  job: string;
  managerName: string;
}

export default interface User {
  id: number;
  job: string;
  firstName: string;
  lastName: string;
  fullName: string;
  name: string;
  status: Status;
  role: Role;
  profileAttributes: UserprofileAttributes;
}
