import { h, type FunctionalComponent, type SVGAttributes, type VNode } from 'vue';

/**
 * An SVG element of an icon: tag name, attributes and optional children
 */
export type IconNode = readonly [
  tag: string,
  attrs: Readonly<Record<string, string>>,
  children?: readonly IconNode[]
];

export interface IconProps extends SVGAttributes {
  /**
   * Width and height of the icon, in pixels when a number. Defaults to 24.
   */
  size?: number | string;
}

export type IconComponent = FunctionalComponent<IconProps>;

/**
 * Turn an icon node and its children into virtual nodes
 */
function render ([tag, attrs, children]: IconNode): VNode {
  return h(tag, attrs, children?.map(render));
}

/**
 * Create the component of an icon from its elements (the content of the 24×24 <svg>).
 * Any attribute (class, style, aria-label, event listeners…) falls through to the <svg>.
 */
export function createIcon (name: string, nodes: readonly IconNode[]): IconComponent {
  const Icon: IconComponent = (props, { attrs }) => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: props.size,
    height: props.size,
    viewBox: '0 0 24 24',
    fill: 'none',
    /**
     * Decorative by default: hidden from assistive technologies unless it is labelled
     */
    'aria-hidden': attrs['aria-label'] || attrs['aria-labelledby'] ? undefined : 'true'
  }, nodes.map(render));

  Icon.displayName = name;
  Icon.props = {
    size: {
      type: [Number, String],
      default: 24
    }
  };

  return Icon;
}
