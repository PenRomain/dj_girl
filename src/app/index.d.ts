declare module "*.svg" {
  import { ComponentType } from "react";
  const content: string;
  export const ReactComponent: ComponentType;
  export default content;
}
