import { CadImagesConfig } from '../types';

/**
 * DEFAULT CAD VISUALIZER IMAGES CONFIGURATION
 * --------------------------------------------
 * You can edit these image URLs directly in this file, OR
 * you can upload photos via the "⚙ Customize CAD Images" button
 * directly inside the website!
 *
 * Local Images Tip:
 * If you place an image in: `public/images/cad/my-tee.jpg`
 * You can set the URL to: `'/images/cad/my-tee.jpg'`
 */
export const DEFAULT_CAD_IMAGES: CadImagesConfig = {
  front: '/images/cad/plain_front.png',
  back: '/images/cad/plain_back.png',
  collar: '/images/cad/collar_detail.png',
  texture: '/images/cad/texture_detail.png',
};
