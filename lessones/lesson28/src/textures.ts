import bridge1 from '@/textures/bridge/px.jpg?url'
import bridge2 from '@/textures/bridge/nx.jpg?url'
import bridge3 from '@/textures/bridge/py.jpg?url'
import bridge4 from '@/textures/bridge/ny.jpg?url'
import bridge5 from '@/textures/bridge/pz.jpg?url'
import bridge6 from '@/textures/bridge/nz.jpg?url'

import castle1 from '@/textures/castle/px.jpg?url'
import castle2 from '@/textures/castle/nx.jpg?url'
import castle3 from '@/textures/castle/py.jpg?url'
import castle4 from '@/textures/castle/ny.jpg?url'
import castle5 from '@/textures/castle/pz.jpg?url'
import castle6 from '@/textures/castle/nz.jpg?url'

import park1 from '@/textures/park/px.jpg?url'
import park2 from '@/textures/park/nx.jpg?url'
import park3 from '@/textures/park/py.jpg?url'
import park4 from '@/textures/park/ny.jpg?url'
import park5 from '@/textures/park/pz.jpg?url'
import park6 from '@/textures/park/nz.jpg?url'

import pisa1 from '@/textures/pisa/px.png?url'
import pisa2 from '@/textures/pisa/nx.png?url'
import pisa3 from '@/textures/pisa/py.png?url'
import pisa4 from '@/textures/pisa/ny.png?url'
import pisa5 from '@/textures/pisa/pz.png?url'
import pisa6 from '@/textures/pisa/nz.png?url'

import sky1 from '@/textures/sky/px.jpg?url'
import sky2 from '@/textures/sky/nx.jpg?url'
import sky3 from '@/textures/sky/py.jpg?url'
import sky4 from '@/textures/sky/ny.jpg?url'
import sky5 from '@/textures/sky/pz.jpg?url'
import sky6 from '@/textures/sky/nz.jpg?url'

import star1 from '@/textures/star/px.jpg?url'
import star2 from '@/textures/star/nx.jpg?url'
import star3 from '@/textures/star/py.jpg?url'
import star4 from '@/textures/star/ny.jpg?url'
import star5 from '@/textures/star/pz.jpg?url'
import star6 from '@/textures/star/nz.jpg?url'

interface TextureMap {
  bridge: Array<string>
  castle: Array<string>
  park: Array<string>
  pisa: Array<string>
  sky: Array<string>
  star: Array<string>
  [key: string]: Array<string>
}
// 材质贴图路径
export const textureMap: TextureMap = {
  bridge: [bridge1, bridge2, bridge3, bridge4, bridge5, bridge6],
  castle: [castle1, castle2, castle3, castle4, castle5, castle6],
  park: [park1, park2, park3, park4, park5, park6],
  pisa: [pisa1, pisa2, pisa3, pisa4, pisa5, pisa6],
  sky: [sky1, sky2, sky3, sky4, sky5, sky6],
  star: [star1, star2, star3, star4, star5, star6],
}
