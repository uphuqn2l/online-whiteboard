/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.enums;

public enum ElementType
{
    Text("txt"), FreeLine("fli"), StraightLine("sli"), Rectangle("rec"), Circle("cir"), Ellipse("ell"), Image("img"), Icon("ico");

    private String type;

    ElementType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public static ElementType getEnum(String type) {
        for (ElementType et : ElementType.values()) {
            if (et.type.equalsIgnoreCase(type)) {
                return et;
            }
        }

        return null;
    }

    public String toString() {
        return getType();
    }
}
