// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Standardized list of supported custom icon keys
export type IconSymbolName =
  | 'house.fill'
  | 'paperplane.fill'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right'
  | 'people.fill'
  | 'person.fill'
  | 'bell.fill'
  | 'warning.fill'
  | 'checkmark.circle.fill'
  | 'clock.fill'
  | 'phone.fill'
  | 'map.fill'
  | 'shield.fill'
  | 'wrench.fill'
  | 'medkit.fill'
  | 'exclamationmark.triangle.fill'
  | 'person.badge.shield.checkmark.fill';

const MAPPING: Record<IconSymbolName, ComponentProps<typeof MaterialIcons>['name']> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'people.fill': 'people',
  'person.fill': 'person',
  'bell.fill': 'notifications',
  'warning.fill': 'warning',
  'checkmark.circle.fill': 'check-circle',
  'clock.fill': 'access-time',
  'phone.fill': 'phone',
  'map.fill': 'map',
  'shield.fill': 'security',
  'wrench.fill': 'build',
  'medkit.fill': 'medical-services',
  'exclamationmark.triangle.fill': 'warning',
  'person.badge.shield.checkmark.fill': 'admin-panel-settings',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: string; // Add optional weight prop to support other existing code usages
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
