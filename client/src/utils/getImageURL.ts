import { SERVER_URL } from "@/constants/server";
import { ImageData } from "@/types/item";

export function getImageURL(image: ImageData) {
  return `${SERVER_URL}${image[0].data}`;
}
