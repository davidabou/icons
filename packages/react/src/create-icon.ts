import { createElement, forwardRef } from 'react';
import type { ForwardRefExoticComponent, ReactElement, RefAttributes, SVGProps } from 'react';

/**
 * An element inside the icon's <svg>: tag, attributes (React names) and child elements
 */
export type IconNode = readonly [tag: string, attrs: Readonly<Record<string, string>>, children?: readonly IconNode[]];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /**
   * Width and height, 24 by default (in pixels when a number)
   */
  size?: number | string;
}

export type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

/**
 * Children are passed as arguments, not as an array, so React does not ask for keys
 */
function render ([tag, attrs, children = []]: IconNode): ReactElement {
  return createElement(tag, attrs, ...children.map(render));
}

/**
 * Create the component of an icon from the elements of its SVG
 *
 * @param name - component name, shown in React DevTools
 * @param nodes - elements inside the <svg> root
 */
export function createIcon (name: string, nodes: readonly IconNode[]): IconComponent {
  const Icon = forwardRef<SVGSVGElement, IconProps>(({ size = 24, children, ...props }, ref) => createElement(
    'svg',
    {
      ref,
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      // Decorative unless labelled
      'aria-hidden': props['aria-label'] || props['aria-labelledby'] ? undefined : true,
      ...props
    },
    ...nodes.map(render),
    children
  ));

  Icon.displayName = name;

  return Icon;
}
