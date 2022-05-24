/** */
export interface WalkSyncFilter {
    /** */
    (fullPath: string, isDir: boolean): boolean;
}
/** */
export declare function walkSync(dir: string, filter?: WalkSyncFilter): string[];
