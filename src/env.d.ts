/// <reference types="vite/client" />

declare module '*.wasm' {
  const value: WebAssembly.Module
  export default value
}

declare module '*.woff' {
  const value: ArrayBuffer
  export default value
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.png?inline' {
  const value: string
  export default value
}
