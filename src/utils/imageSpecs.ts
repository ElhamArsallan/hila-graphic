export type ImageSpec = {
  label: string;
  recommendedWidth: number;
  recommendedHeight: number;
  aspectRatio: string;
  minimumWidth: number;
  minimumHeight: number;
  maxFileSizeMb: number;
  formats: readonly string[];
};

export const IMAGE_SPECS = {
  logo: {
    label: 'Brand logo',
    recommendedWidth: 1800,
    recommendedHeight: 600,
    aspectRatio: '3:1',
    minimumWidth: 900,
    minimumHeight: 300,
    maxFileSizeMb: 10,
    formats: ['JPG', 'PNG', 'WebP', 'SVG'],
  },
  favicon: {
    label: 'Browser favicon',
    recommendedWidth: 512,
    recommendedHeight: 512,
    aspectRatio: '1:1',
    minimumWidth: 96,
    minimumHeight: 96,
    maxFileSizeMb: 2,
    formats: ['PNG', 'ICO', 'SVG'],
  },
  background: {
    label: 'Background hero image',
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    aspectRatio: '16:9',
    minimumWidth: 1200,
    minimumHeight: 675,
    maxFileSizeMb: 12,
    formats: ['JPG', 'PNG', 'WebP'],
  },
  founder: {
    label: 'Founder profile photo',
    recommendedWidth: 1200,
    recommendedHeight: 1200,
    aspectRatio: '1:1',
    minimumWidth: 800,
    minimumHeight: 800,
    maxFileSizeMb: 8,
    formats: ['JPG', 'PNG', 'WebP'],
  },
  serviceCover: {
    label: 'Service cover image',
    recommendedWidth: 1200,
    recommendedHeight: 675,
    aspectRatio: '16:9',
    minimumWidth: 800,
    minimumHeight: 450,
    maxFileSizeMb: 10,
    formats: ['JPG', 'PNG', 'WebP'],
  },
  portfolioCover: {
    label: 'Portfolio cover image',
    recommendedWidth: 1200,
    recommendedHeight: 900,
    aspectRatio: '4:3',
    minimumWidth: 800,
    minimumHeight: 600,
    maxFileSizeMb: 10,
    formats: ['JPG', 'PNG', 'WebP'],
  },
  gallery: {
    label: 'Gallery / sample image',
    recommendedWidth: 1500,
    recommendedHeight: 1000,
    aspectRatio: '3:2',
    minimumWidth: 900,
    minimumHeight: 600,
    maxFileSizeMb: 12,
    formats: ['JPG', 'PNG', 'WebP'],
  },
} as const;

export function getAspectRatioLabel(width: number, height: number) {
  if (!width || !height) return 'Unknown';
  const gcd = function (a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  };
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export function getRatioWarning(spec: ImageSpec, width: number, height: number) {
  const actualRatio = width / height;
  const expectedRatio = spec.recommendedWidth / spec.recommendedHeight;
  const tolerance = 0.12;
  if (Math.abs(actualRatio - expectedRatio) <= tolerance) {
    return null;
  }
  return `Recommended aspect ratio: ${spec.aspectRatio}. Your image is ${getAspectRatioLabel(width, height)}.`;
}

export function formatImageSpec(spec: ImageSpec) {
  return `${spec.recommendedWidth} × ${spec.recommendedHeight} px`;
}

export function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to read image dimensions.'));
    };
    image.src = objectUrl;
  });
}
