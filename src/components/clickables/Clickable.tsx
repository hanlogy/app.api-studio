import { useState, type ComponentProps, type PropsWithChildren } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

type Props = PropsWithChildren<
  ComponentProps<typeof Pressable> & {
    style?: StyleProp<ViewStyle>;
    pressedStyle?: StyleProp<ViewStyle>;
    hoveredStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
  }
>;

export function Clickable({
  children,
  style,
  pressedStyle,
  hoveredStyle,
  disabled = false,
  ...restProps
}: Props) {
  const [hovered, setHovered] = useState(false);
  const hasHoveredStyle = !!hoveredStyle;

  return (
    <Pressable
      disabled={disabled}
      onHoverIn={
        hasHoveredStyle && !disabled ? () => setHovered(true) : undefined
      }
      onHoverOut={
        hasHoveredStyle && !disabled ? () => setHovered(false) : undefined
      }
      style={({ pressed }) => [
        { cursor: 'pointer' },
        style,
        hovered && hoveredStyle,
        pressed && pressedStyle,
      ]}
      {...restProps}>
      {children}
    </Pressable>
  );
}
