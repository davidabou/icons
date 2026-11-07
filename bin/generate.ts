import { optimize, type XastElement, type XastRoot } from 'svgo';
import { Resvg } from '@resvg/resvg-js';
import path from 'node:path';
import fs from 'node:fs';

/**
 * An optimized icon: export name and svg code
 */
interface Icon {
  name: string;
  svg: string;
}

/**
 * An element inside an icon's <svg> root, as [tag, attrs, children?]
 */
type IconNode = [tag: string, attrs: Record<string, string>, children?: IconNode[]];

/**
 * Icon of the framework packages (packages/vue, packages/react)
 */
interface Component {
  name: string;
  nodes: IconNode[];
}

/**
 * Module for generating icon pack file from svg icons
 */
class IconsGenerator {
  /**
   * Path to package's root
   */
  readonly ROOT_DIR = path.resolve(import.meta.dirname, '..');

  /**
   * Input files and dirs
   */
  readonly INPUT_ICONS_DIR = path.join(this.ROOT_DIR, 'src', 'icons');

  /**
   * Output files and dirs
   */
  readonly OUTPUT_DIST_DIR = path.join(this.ROOT_DIR, 'dist');
  readonly OUTPUT_SRC_DIR = path.join(this.ROOT_DIR, 'src');
  readonly OUTPUT_ICONS_DIR = path.join(this.OUTPUT_DIST_DIR, 'icons');
  readonly OUTPUT_BUNDLE_FILE = path.join(this.OUTPUT_SRC_DIR, 'index.ts');
  readonly OUTPUT_SHOWCASE_FILE = path.join(this.ROOT_DIR, 'showcase.png');
  readonly OUTPUT_VUE_FILE = path.join(this.ROOT_DIR, 'packages', 'vue', 'src', 'icons.ts');
  readonly OUTPUT_REACT_FILE = path.join(this.ROOT_DIR, 'packages', 'react', 'src', 'icons.ts');

  /**
   * Showcase image layout: white icons on a dark background, 2x scale
   */
  readonly SHOWCASE = {
    columns: 11,
    iconSize: 48,
    step: 96,
    paddingX: 218,
    paddingY: 158,
    background: '#17191F',
    color: '#FFFFFF'
  };

  /**
   * Optimized icons to be drawn on the showcase image
   */
  SHOWCASE_ICONS: Icon[] = [];

  /**
   * Icons of the framework packages (packages/vue, packages/react)
   */
  COMPONENTS: Component[] = [];

  /**
   * List of input svg files
   */
  files: string[] = [];

  /**
   * Main list of actions
   */
  run(): void {
    this.recreateOutputDirectory();
    this.createOutputScript();

    this.getSvgFiles();
    this.processSvgFiles();

    this.renderShowcase();
    this.writeComponents('Vue', this.OUTPUT_VUE_FILE, attrs => attrs);
    this.writeComponents('React', this.OUTPUT_REACT_FILE, attrs => this.toReactAttributes(attrs));

    this.showReport();
  }

  /**
   * Recreating output directory
   */
  recreateOutputDirectory(): void {
    console.log('🗄 Recreating output directory');

    fs.rmSync(this.OUTPUT_DIST_DIR, { recursive: true, force: true });
    fs.mkdirSync(this.OUTPUT_ICONS_DIR, { recursive: true });
  }

  /**
   * Create an output script
   */
  createOutputScript(): void {
    fs.writeFileSync(this.OUTPUT_BUNDLE_FILE, '');
  }

  /**
   * Get all SVG files from icons directory
   */
  getSvgFiles(): void {
    console.log('🔎 Getting SVG files');

    /**
     * Sort explicitly so the output order does not depend on the file system
     */
    this.files = fs.readdirSync(this.INPUT_ICONS_DIR)
      .filter(file => file.endsWith('.svg'))
      .sort();
  }

  /**
   * Going through all found SVG files and process them
   */
  processSvgFiles(): void {
    console.log('🛠 Processing SVG files');

    /**
     * Going through all SVG files
     */
    this.files.forEach(filename => {
      process.stdout.write(`💎 ${filename} -> `);

      /**
       * Generate icon's export name
       */
      const exportName = this.generateIconExportName(filename);

      console.log(`${exportName}`);

      /**
       * Read icon's code
       */
      const iconCode = fs.readFileSync(path.join(this.INPUT_ICONS_DIR, filename), 'utf8');

      /**
       * Optimize icon
       */
      const { svg: optimizedSvgString, root } = this.optimizeSvg(iconCode);

      /**
       * Creating icon's object to simplify processing calls
       */
      const icon: Icon = {
        name: exportName,
        svg: optimizedSvgString
      };

      /**
       * Add icon to the icons bundle
       */
      this.appendIconToBundle(icon);

      /**
       * Save optimized file to output directory
       */
      this.saveOptimizedSvg(icon);

      /**
       * Keep icon for the showcase image
       */
      this.SHOWCASE_ICONS.push(icon);

      /**
       * Add the icon's Vue and React components
       */
      this.COMPONENTS.push({ name: icon.name, nodes: this.svgToNodes(root, icon.svg) });
    });
  }

  /**
   * Generate icon's export name
   *
   * @param filename - name of the svg file
   */
  generateIconExportName(filename: string): string {
    /** Get the filename */
    const name = filename

      /** Get text name without extension */
      .split('.')[0]

      /** Replace all non-alphanumeric characters with space */
      .replace(/[^a-zA-Z0-9]/g, ' ')

      /** Uppercase each word and join chunks to the single word */
      .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

    /**
     * Add "Icon" prefix and return the new name
     */
    return `Icon${name}`;
  }

  /**
   * Optimize SVG code
   *
   * @param svg - SVG code
   *
   * @returns optimized code, and its syntax tree (xast)
   */
  optimizeSvg(svg: string): { svg: string; root: XastRoot } {
    /**
     * Syntax tree of the optimized icon, kept by the last plugin, right before it is serialized
     */
    let root: XastRoot | undefined;

    /**
     * Optimizing SVG with SVGO package
     * Read more: https://github.com/svg/svgo#api-usage
     */
    const result = optimize(svg, {
      plugins: [
        'sortAttrs',
        {
          name: 'convertColors',
          params: {
            currentColor: true
          }
        },
        {
          name: 'collectRoot',
          fn: tree => {
            root = tree;
          }
        }
      ]
    });

    if (!root) {
      throw new Error(`No syntax tree for: ${svg}`);
    }

    return { svg: result.data, root };
  }

  /**
   * Append icon to the icons bundle
   */
  appendIconToBundle({ name, svg }: Icon): void {
    fs.appendFileSync(this.OUTPUT_BUNDLE_FILE, `export const ${name}: string = '${svg}';\n`);
  }

  /**
   * Save optimized file to output directory
   */
  saveOptimizedSvg({ name, svg }: Icon): void {
    fs.writeFileSync(path.join(this.OUTPUT_ICONS_DIR, `${name}.svg`), svg);
  }

  /**
   * Render all icons as a grid to the showcase.png image
   */
  renderShowcase(): void {
    console.log('🖼 Rendering the showcase.png image');

    const { columns, iconSize, step, paddingX, paddingY, background, color } = this.SHOWCASE;
    const rows = Math.ceil(this.SHOWCASE_ICONS.length / columns);
    const width = paddingX * 2 + step * (columns - 1) + iconSize;
    const height = paddingY * 2 + step * (rows - 1) + iconSize;

    /**
     * Place each icon as a nested <svg> scaled to the cell size
     */
    const cells = this.SHOWCASE_ICONS.map(({ svg }, index) => {
      const x = paddingX + step * (index % columns);
      const y = paddingY + step * Math.floor(index / columns);

      return svg.replace('<svg ', `<svg x="${x}" y="${y}" `)
        .replace(/ width="[^"]*"/, ` width="${iconSize}"`)
        .replace(/ height="[^"]*"/, ` height="${iconSize}"`);
    });

    const showcaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" color="${color}">`
      + `<rect width="100%" height="100%" fill="${background}"/>`
      + cells.join('')
      + '</svg>';

    const png = new Resvg(showcaseSvg).render().asPng();

    fs.writeFileSync(this.OUTPUT_SHOWCASE_FILE, png);
  }

  /**
   * Convert an optimized SVG to the elements inside its <svg> root, as [tag, attrs, children?] nodes
   *
   * @param tree - syntax tree (xast) of the optimized svg
   * @param svg - optimized svg code, for the error message
   */
  svgToNodes(tree: XastRoot, svg: string): IconNode[] {
    const root = tree.children.find((node): node is XastElement => node.type === 'element');

    if (root?.attributes.viewBox !== '0 0 24 24' || root.attributes.fill !== 'none') {
      throw new Error(`Unexpected <svg> root: ${svg}`);
    }

    const toNode = ({ name, attributes, children }: XastElement): IconNode => {
      const elements = children.filter((child): child is XastElement => child.type === 'element');

      return elements.length
        ? [name, attributes, elements.map(toNode)]
        : [name, attributes];
    };

    return root.children
      .filter((node): node is XastElement => node.type === 'element')
      .map(toNode);
  }

  /**
   * Generate icon's name in kebab-case, as used by the website URLs and the Nuxt <CodeXIcon>:
   * IconTableWithHeadings → table-with-headings, IconH1 → h1
   *
   * @param name - export name of the icon
   */
  generateIconSlug(name: string): string {
    return name
      .replace(/^Icon/, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  /**
   * Rename the attributes of a node for React (stroke-width → strokeWidth)
   *
   * @param attrs - attributes of a node
   */
  toReactAttributes(attrs: Record<string, string>): Record<string, string> {
    return Object.fromEntries(Object.entries(attrs)
      .map(([key, value]) => [key.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), value]));
  }

  /**
   * Write the components file of a framework package (one createIcon() call per icon),
   * followed by the map of all icons by name
   *
   * @param framework - name shown in the logs
   * @param file - output file
   * @param mapAttributes - converts the attributes of each node for the framework
   */
  writeComponents(
    framework: string,
    file: string,
    mapAttributes: (attrs: Record<string, string>) => Record<string, string>
  ): void {
    console.log(`🧩 Writing the ${framework} components`);

    const mapNodes = (nodes: IconNode[]): IconNode[] => nodes.map(([tag, attrs, children]) => children
      ? [tag, mapAttributes(attrs), mapNodes(children)]
      : [tag, mapAttributes(attrs)]);

    const lines = [
      '// Generated by bin/generate.ts from src/icons, do not edit.',
      "import { createIcon } from './create-icon';",
      '',
      ...this.COMPONENTS.map(({ name, nodes }) => `export const ${name} = /* @__PURE__ */ createIcon('${name}', ${JSON.stringify(mapNodes(nodes))});`),
      '',
      '/**',
      " * All icons by name (kebab-case), for dynamic use: icons['arrow-left'].",
      ' * Importing it bundles every icon: prefer the named exports when the icon is known.',
      ' */',
      'export const icons = {',
      ...this.COMPONENTS.map(({ name }) => `  '${this.generateIconSlug(name)}': ${name},`),
      '};',
      '',
      '/**',
      ' * Union type of the icon names (kebab-case)',
      ' */',
      'export type IconName = keyof typeof icons;'
    ];

    fs.writeFileSync(file, `${lines.join('\n')}\n`);
  }

  /**
   * Just a check for number of input and output files
   */
  showReport(): void {
    /**
     * Count input files
     */
    const inputFilesLength = fs.readdirSync(this.INPUT_ICONS_DIR)
      .filter(file => file.endsWith('.svg'))
      .length;

    /**
     * Count output files
     */
    const outputFilesLength = fs.readdirSync(this.OUTPUT_ICONS_DIR)
      .filter(file => file.endsWith('.svg'))
      .length;

    console.log(`📊 ${outputFilesLength} of ${inputFilesLength} icons were generated`);
  }
}

/**
 * Run generator
 */
new IconsGenerator().run();
