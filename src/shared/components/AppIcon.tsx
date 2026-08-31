import React, { memo } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { IconProps } from 'react-native-vector-icons/Icon';

export type AppIconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = IconProps & {
  name: AppIconName;
};

export const AppIcon = memo(function AppIcon({ name, size = 22, ...rest }: Props) {
  return <Ionicons name={name} size={size} {...rest} />;
});
