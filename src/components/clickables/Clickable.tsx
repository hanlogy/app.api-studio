import { useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native-macos';

type Props = Omit<ComponentProps<typeof Pressable>, 'children'> & {
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  hoveredStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  children: ((state?: 'hovered' | 'pressed') => ReactNode) | ReactNode;
};

export function Clickable({
  children,
  style,
  pressedStyle,
  hoveredStyle,
  disabled = false,
  ...restProps
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      disabled={disabled}
      onHoverIn={!disabled ? () => setHovered(true) : undefined}
      onHoverOut={!disabled ? () => setHovered(false) : undefined}
      style={({ pressed }) => [
        { cursor: 'pointer' },
        style,
        hovered && hoveredStyle,
        pressed && pressedStyle,
      ]}
      {...restProps}>
      {({ pressed }) => {
        return typeof children === 'function'
          ? children(pressed ? 'pressed' : hovered ? 'hovered' : undefined)
          : children;
      }}
    </Pressable>
  );
}
