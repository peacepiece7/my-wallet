import { createGlobalStyle } from "styled-components";

/**
 * CSS RESET : A (more) Modern CSS Reset
 * @see https://piccalil.li/blog/a-more-modern-css-reset/
 * @see https://ykss.netlify.app/translation/a_more_modern_css_reset/?utm_source=substack&utm_medium=email
 */
export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }
    body {
        width : 100%;
        margin : 0;
    }
    html {
        font-size : 62.5%;
    }
`;