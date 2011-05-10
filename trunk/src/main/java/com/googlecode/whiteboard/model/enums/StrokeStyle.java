/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.enums;

public enum StrokeStyle
{
    No(""), Dash("-"), Dot("."), DashDot("-."), DashDotDot("-.."), DotBlank(". "), DashBlank("- "),
    DashDash("--"), DashBlankDot("- ."), DashDashDot("--."), DashDashDotDot("--..");

    private String style;

    StrokeStyle(String style) {
        this.style = style;
    }

    public String getStyle() {
        return style;
    }

    public static StrokeStyle getEnum(String style) {
        for (StrokeStyle ss : StrokeStyle.values()) {
            if (ss.style.equals(style)) {
                return ss;
            }
        }

        return null;
    }
}
