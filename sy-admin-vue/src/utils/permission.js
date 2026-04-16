import { pinia } from '@/stores';
import { usePermissionStore } from '@/stores/modules/permission';

export function hasPermission(required, mode = 'some') {
  const permissionStore = usePermissionStore(pinia);
  return permissionStore.hasPermission(required, mode);
}
