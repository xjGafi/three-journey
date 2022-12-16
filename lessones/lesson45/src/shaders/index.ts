const importShaders = import.meta.glob('./**/*.glsl', { as: 'raw' })

const shaders: Array<Shader> = []

const shaderList = Object.keys(importShaders)
for (let i = 0; i < shaderList.length; i += 2) {
  const fragmentShader = await importShaders[shaderList[i]]()
  const vertexShader = await importShaders[shaderList[i + 1]]()
  shaders.push({ fragmentShader, vertexShader })
}

export default shaders
