import matcaps1 from '@/textures/matcaps/1.png?url';
import matcaps2 from '@/textures/matcaps/2.png?url';
import matcaps3 from '@/textures/matcaps/3.png?url';
import matcaps4 from '@/textures/matcaps/4.png?url';
import matcaps5 from '@/textures/matcaps/5.png?url';
import matcaps6 from '@/textures/matcaps/6.png?url';
import matcaps7 from '@/textures/matcaps/7.png?url';
import matcaps8 from '@/textures/matcaps/8.png?url';

interface TextureMap {
  [key: string]: string;
}
// 材质贴图路径
export const textureMap: TextureMap = {
  matcaps1,
  matcaps2,
  matcaps3,
  matcaps4,
  matcaps5,
  matcaps6,
  matcaps7,
  matcaps8
};
