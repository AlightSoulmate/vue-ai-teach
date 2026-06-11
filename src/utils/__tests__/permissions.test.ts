import { describe, expect, it } from "vitest";
import { canAccessMeta, getMenusByRole, hasPermission } from "@/constants/permissions";

describe("permissions", () => {
  it("checks button level permission", () => {
    expect(hasPermission("teacher", "assignment:grade")).toBe(true);
    expect(hasPermission("student", "assignment:grade")).toBe(false);
  });

  it("checks route meta access", () => {
    expect(canAccessMeta("admin", { title: "学生管理", roles: ["admin"] })).toBe(true);
    expect(canAccessMeta("student", { title: "学生管理", roles: ["admin"] })).toBe(false);
  });

  it("generates dynamic menus by role", () => {
    const teacherMenus = getMenusByRole("teacher").map((item) => item.path);
    expect(teacherMenus).toContain("/home/teacherAssignments");
    expect(teacherMenus).not.toContain("/home/stuList");
  });
});
