import type { RouteRecordRaw } from "vue-router";
import {
  Collection,
  DataAnalysis,
  Document,
  DocumentChecked,
  Files,
  Memo,
  Setting,
  User,
} from "@element-plus/icons-vue";

export type AppRole = "admin" | "teacher" | "student";

export type PermissionCode =
  | "tool:read"
  | "tool:manage"
  | "course:read"
  | "course:manage"
  | "assignment:read"
  | "assignment:publish"
  | "assignment:grade"
  | "student:manage"
  | "teacher:manage"
  | "inbox:read";

export interface AppRouteMeta {
  title: string;
  public?: boolean;
  roles?: AppRole[];
  permissions?: PermissionCode[];
  menu?: boolean;
  icon?: typeof Collection;
}

export interface AppMenuItem {
  title: string;
  path: string;
  icon: typeof Collection;
  roles: AppRole[];
  permissions?: PermissionCode[];
}

export const rolePermissions: Record<AppRole, PermissionCode[]> = {
  admin: ["tool:read", "tool:manage", "student:manage", "teacher:manage"],
  teacher: [
    "tool:read",
    "course:read",
    "course:manage",
    "assignment:read",
    "assignment:publish",
    "assignment:grade",
  ],
  student: ["tool:read", "course:read", "assignment:read", "inbox:read"],
};

export const defaultRouteByRole: Record<AppRole, string> = {
  admin: "/home/stuList",
  teacher: "/home",
  student: "/home",
};

export const appMenus: AppMenuItem[] = [
  {
    title: "AI 工具集",
    path: "/home",
    icon: Collection,
    roles: ["admin", "teacher", "student"],
    permissions: ["tool:read"],
  },
  {
    title: "工具管理",
    path: "/home/toolList",
    icon: Setting,
    roles: ["admin"],
    permissions: ["tool:manage"],
  },
  {
    title: "学生管理",
    path: "/home/stuList",
    icon: User,
    roles: ["admin"],
    permissions: ["student:manage"],
  },
  {
    title: "教师管理",
    path: "/home/teaList",
    icon: User,
    roles: ["admin"],
    permissions: ["teacher:manage"],
  },
  {
    title: "课程管理",
    path: "/home/teacherCourse",
    icon: Files,
    roles: ["teacher"],
    permissions: ["course:manage"],
  },
  {
    title: "作业管理",
    path: "/home/teacherAssignments",
    icon: Memo,
    roles: ["teacher"],
    permissions: ["assignment:publish", "assignment:grade"],
  },
  {
    title: "AI 批改中心",
    path: "/home/teacherGrading",
    icon: DocumentChecked,
    roles: ["teacher"],
    permissions: ["assignment:grade"],
  },
  {
    title: "评价记录",
    path: "/home/studentCourse",
    icon: DataAnalysis,
    roles: ["student"],
    permissions: ["course:read"],
  },
  {
    title: "作业记录",
    path: "/home/studentEvals",
    icon: Memo,
    roles: ["student"],
    permissions: ["assignment:read"],
  },
  {
    title: "收件箱",
    path: "/home/studentInbox",
    icon: Document,
    roles: ["student"],
    permissions: ["inbox:read"],
  },
];

export function isAppRole(role?: string): role is AppRole {
  return role === "admin" || role === "teacher" || role === "student";
}

export function hasPermission(role: string | undefined, permission: PermissionCode): boolean {
  return isAppRole(role) && rolePermissions[role].includes(permission);
}

export function hasEveryPermission(
  role: string | undefined,
  permissions: PermissionCode[] = [],
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

export function canAccessMeta(role: string | undefined, meta: Partial<AppRouteMeta>): boolean {
  if (meta.public) return true;
  if (!isAppRole(role)) return false;
  const roleAllowed = !meta.roles?.length || meta.roles.includes(role);
  return roleAllowed && hasEveryPermission(role, meta.permissions);
}

export function getMenusByRole(role: string | undefined): AppMenuItem[] {
  if (!isAppRole(role)) return [];
  return appMenus.filter((item) => {
    return item.roles.includes(role) && hasEveryPermission(role, item.permissions);
  });
}

export function createRouteMeta(meta: AppRouteMeta): RouteRecordRaw["meta"] {
  return meta as RouteRecordRaw["meta"];
}
