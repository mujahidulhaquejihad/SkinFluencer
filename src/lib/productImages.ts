/**
 * Product images from src/product pictures – imported so Next.js can optimize them.
 * Order determines which product index gets which image (cycled).
 */
import img0 from "../product pictures/pexels-anfel-lanane-2356529-29675492.jpg";
import img1 from "../product pictures/pexels-anfel-lanane-2356529-29675494.jpg";
import img2 from "../product pictures/pexels-anfel-lanane-2356529-29675496.jpg";
import img3 from "../product pictures/pexels-anfel-lanane-2356529-29675498.jpg";
import img4 from "../product pictures/pexels-anfel-lanane-2356529-30644430.jpg";
import img5 from "../product pictures/pexels-anfel-lanane-2356529-33362027.jpg";
import img6 from "../product pictures/pexels-angel-adu-gyamfi-2799213-10631912.jpg";
import img7 from "../product pictures/pexels-createdstories-11464419.jpg";
import img8 from "../product pictures/pexels-madalina-enache-1540051428-28758251.jpg";
import img9 from "../product pictures/pexels-misolo-cosmetic-2588316-4841458.jpg";
import img10 from "../product pictures/pexels-pinkwitch-3302622-12851388.jpg";
import img11 from "../product pictures/pexels-polina-tankilevitch-3735625.jpg";
import img12 from "../product pictures/pexels-sales-trust-162265874-10825665.jpg";
import img13 from "../product pictures/pexels-yaazhini-17656719.jpg";

const productImageSources = [
  img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13,
];

/** Get image src string for Next.js Image (by product index, cycled) */
export function getProductImageSrc(index: number): string {
  const img = productImageSources[index % productImageSources.length];
  return (img as { src: string }).src;
}

/** All product image modules for use in components that need the full import */
export const productImages = productImageSources;
