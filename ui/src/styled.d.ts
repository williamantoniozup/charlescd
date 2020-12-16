import 'styled-components';
import { ThemeScheme } from 'core/assets/themes';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeScheme {}
}
