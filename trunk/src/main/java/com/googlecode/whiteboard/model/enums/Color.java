/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.enums;

/**
 * Some colors with hex-code.
 */
public enum Color
{
    Black("#000000"), White("#FFFFFF"), Red("#FF0000");

    private String color;

    Color(String color) {
        this.color = color;
    }

    public String getColor() {
        return color;
    }

    public static Color getEnum(String color) {
        for (Color co : Color.values()) {
            if (co.color.equals(color)) {
                return co;
            }
        }

        return null;
    }
}
