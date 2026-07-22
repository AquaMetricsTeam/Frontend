export function useHasPermission(_options?: {
  requiredPermissions: PermissionKey[];
  operator?: PermissionsOperator;
}) {
  return {
    hasPermission: true,
    isLoading: false,
  };
}
