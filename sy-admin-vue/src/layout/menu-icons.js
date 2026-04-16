import IconEpCollectionTag from '~icons/ep/collection-tag';
import IconEpDocument from '~icons/ep/document';
import IconEpFiles from '~icons/ep/files';
import IconEpGrid from '~icons/ep/grid';
import IconEpHomeFilled from '~icons/ep/home-filled';
import IconEpLock from '~icons/ep/lock';
import IconEpMenu from '~icons/ep/menu';
import IconEpMonitor from '~icons/ep/monitor';
import IconEpOfficeBuilding from '~icons/ep/office-building';
import IconEpSetting from '~icons/ep/setting';
import IconEpTickets from '~icons/ep/tickets';
import IconEpUser from '~icons/ep/user';

const menuIconMap = {
  home: IconEpHomeFilled,
  'icon-set': IconEpSetting,
  'icon-auth': IconEpLock,
  'icon-menu': IconEpMenu,
  'icon-user': IconEpUser,
  'icon-dept': IconEpOfficeBuilding,
  'icon-goods': IconEpTickets,
  'icon-log': IconEpDocument,
  'icon-task': IconEpMonitor,
  'icon-upload': IconEpFiles,
  'icon-dict': IconEpCollectionTag,
};

export function resolveMenuIcon(icon) {
  return menuIconMap[icon] || IconEpGrid;
}
