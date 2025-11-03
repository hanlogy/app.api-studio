import { useState, type ComponentProps, type PropsWithChildren } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

type Props = PropsWithChildren<
  ComponentProps<typeof Pressable> & {
    style?: StyleProp<ViewStyle>;
    pressedStyle?: StyleProp<ViewStyle>;
    hoveredStyle?: StyleProp<ViewStyle>;
  }
>;

export function Button({
  children,
  style,
  pressedStyle,
  hoveredStyle,
  ...restProps
}: Props) {
  const [hovered, setHovered] = useState(false);
  const hasHoveredStyle = !!hoveredStyle;

  return (
    <Pressable
      onHoverIn={hasHoveredStyle ? () => setHovered(true) : undefined}
      onHoverOut={hasHoveredStyle ? () => setHovered(false) : undefined}
      style={({ pressed }) => [
        style,
        hovered && hoveredStyle,
        pressed && pressedStyle,
      ]}
      {...restProps}>
      {children}
    </Pressable>
  );
}
