/** */
export interface DocPartialFrontMatter {
  /** Partial identifier. */
  devGuideId: string;

  /** Other properties. */
  [key: string]: any;
}

/** */
export interface DocPartial {
  /** Partial identifier. */
  id: string;

  /** File containing the partial. */
  file: string;

  /** Front matter. */
  frontMatter: DocPartialFrontMatter;
  
  /** Partial content. */
  content: string;
}