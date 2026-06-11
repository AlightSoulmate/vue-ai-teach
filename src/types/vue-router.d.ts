import "vue-router";
import type { AppRole, PermissionCode } from "@/constants/permissions";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    public?: boolean;
    roles?: AppRole[];
    permissions?: PermissionCode[];
    menu?: boolean;
  }
}
