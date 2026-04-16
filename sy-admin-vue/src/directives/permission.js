import { pinia } from '@/stores';
import { usePermissionStore } from '@/stores/modules/permission';

function updatePermissionVisibility(el, binding) {
  const permissionStore = usePermissionStore(pinia);
  const mode = binding.arg === 'every' ? 'every' : 'some';
  const visible = permissionStore.hasPermission(binding.value, mode);

  if (el.__permissionOriginalDisplay === undefined) {
    el.__permissionOriginalDisplay = el.style.display || '';
  }

  el.style.display = visible ? el.__permissionOriginalDisplay : 'none';
}

export const permissionDirective = {
  mounted(el, binding) {
    updatePermissionVisibility(el, binding);
  },
  updated(el, binding) {
    updatePermissionVisibility(el, binding);
  },
};

export function setupPermissionDirective(app) {
  app.directive('permission', permissionDirective);
}
