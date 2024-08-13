import { aspectRatioOptions } from "@/constants"
import { type ClassValue, clsx } from "clsx"
// qs 用于解析和操作URL查询字符串
import qs from "qs"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ERROR HANDLER
export const handleError = (error: unknown) => {
  if(error instanceof Error) {
    // 这是一个原生JS错误（例如TypeError， RangeError） 
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  }else if (typeof error === "string") {
    // 这是一个字符串错误
    console.error(error);
    throw new Error(`Error: ${error}`);
  }else {
    // 这是一个未知错误
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`)
  }
}

// 占位符装载器 - 图像正在转换
// 用于在图像加载时显示占位符, 直到图像完全加载, 防止图像闪烁, 提高用户体验
const shimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#7986AC" offset="20%" />
        <stop stop-color="#68769e" offset="50%" />
        <stop stop-color="#7986AC" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#7986AC" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>
`

// 将字符串转换为base64编码, 用于在浏览器中显示图像
const toBase64 = (str: string) => 
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str)

// 用于在图像加载时显示占位符, 直到图像完全加载, 防止图像闪烁, 提高用户体验
export const dataUrl = `data:image/svg+xml;base64,${toBase64(shimmer(1000, 1000))}`
// ==== End

// FORM URL QUERY
export const formUrlQuery = ({
  searchParams,
  key,
  value,
}: FormUrlQueryParams) => {
  const params = { ...qs.parse(searchParams.toString()), [key]: value }

  return `${window.location.pathname}?${qs.stringify(params, {
    skipNulls: true,
  })}`
}

// REMOVE KEY FROM QUERY
export function removeKeysFromQuery({
  searchParams,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(searchParams);

  // 遍历keysToRemove数组, 删除每个键值对
  keysToRemove.forEach((key: string) => {
    delete currentUrl[key];
  });

  // 删除所有为null或undefined的键值对
  Object.keys(currentUrl).forEach(
    (key) => currentUrl[key] == null && delete currentUrl[key]
  );

  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

// DEBOUNCE
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// GE IMAGE SIZE
export type AspectRatioKey = keyof typeof aspectRatioOptions;
export const getImageSize = (
  type: string,
  image: any,
  dimension: "width" | "height"
): number => {
  if (type === "fill") {
    return (
      aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] ||
      1000
    );
  }
  return image?.[dimension] || 1000;
};

// DOWNLOAD IMAGE
export const download = (url: string, filename: string) => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length)
        a.download = `${filename.replace(" ", "_")}.png`;
      document.body.appendChild(a);
      a.click();
    })
    .catch((error) => console.log({ error }));
};

// DEEP MERGE OBJECTS
export const deepMergeObjects = (obj1: any, obj2: any) => {
  if(obj2 === null || obj2 === undefined) {
    return obj1;
  }

  let output = { ...obj2 };

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        obj2[key] &&
        typeof obj2[key] === "object"
      ) {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
};
