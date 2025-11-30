declare module 'nprogress' {
  interface NProgress {
    start(): void
    done(force?: boolean): void
    set(n: number): NProgress
    inc(amount?: number): NProgress
    configure(options: Record<string, unknown>): void
    remove(): void
    status?: number
  }

  const nprogress: NProgress
  export default nprogress
}
