/**
 * Union type for available icon names
 */
export type CodeXIconName = Extract<keyof typeof import('@davidabou/icons-vue'), `Icon${string}`>;

/**
 * @deprecated Renamed to CodeXIconName
 */
export type DaIconName = CodeXIconName;
