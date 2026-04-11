/// <reference types="vite/client" />

declare module 'qrcode.react' {
    import type { CSSProperties } from 'react'
    interface QRCodeProps {
        value: string
        size?: number
        bgColor?: string
        fgColor?: string
        level?: 'L' | 'M' | 'Q' | 'H'
        marginSize?: number
        title?: string
        style?: CSSProperties
        className?: string
    }
    export function QRCodeCanvas(props: QRCodeProps): JSX.Element
    export function QRCodeSVG(props: QRCodeProps): JSX.Element
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
