/* Type declarations for CSS module imports
   Allows importing .css files without TypeScript errors */
declare module "*.css" {
  const css: Record<string, string>;
  export default css;
}
