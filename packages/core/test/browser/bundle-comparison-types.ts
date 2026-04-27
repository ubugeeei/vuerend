export type BundleVariant = "standard" | "vapor";

export interface BundleAssetSize {
  bytes: number;
  file: string;
  gzipBytes: number;
  kind: "css" | "js" | "other";
}

export interface BundleBuildSize {
  assets: BundleAssetSize[];
  indexUrl: string;
  name: BundleVariant;
  totalBytes: number;
  totalGzipBytes: number;
}

export interface BundleComparison {
  delta: {
    bytes: number;
    gzipBytes: number;
    gzipPercent: number;
  };
  standard: BundleBuildSize;
  vapor: BundleBuildSize;
}
