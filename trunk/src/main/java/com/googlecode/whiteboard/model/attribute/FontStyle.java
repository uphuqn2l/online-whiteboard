/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.attribute;

/**
 * Enum for font styles "normal" and "italic".
 *
 * @author ova / last modified by $Author$
 * @version $Revision$
 */
public enum FontStyle
{
    Normal("normal"), Italic("italic");

    private String style;

    FontStyle(String style) {
        this.style = style;
    }

    public String getStyle() {
        return style;
    }

    public static FontStyle getEnum(String style) {
        for (FontStyle fs : FontStyle.values()) {
            if (fs.style.equals(style)) {
                return fs;
            }
        }

        return null;
    }
}
