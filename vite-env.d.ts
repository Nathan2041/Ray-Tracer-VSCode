/// <reference types="vite/client" />

declare module '*.obj?url&raw' {
  const content: string;
  export default content;
}

declare module '*.mtl?url&raw' {
  const content: string;
  export default content;
}