/**
 * Union type for available icon names, in kebab-case: 'heart', 'arrow-left', 'h1'…
 */
export type CodeXIconName = import('@davidabou/icons-vue').IconName;

/**
 * @deprecated Names of the former <DaIcon> ('IconHeart'…). Use <CodeXIcon> and CodeXIconName.
 */
export type DaIconName = Extract<keyof typeof import('@davidabou/icons-vue'), `Icon${string}`>;
