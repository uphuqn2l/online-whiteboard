/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import com.googlecode.whiteboard.model.enums.ElementType;

public abstract class AbstractElement
{
    private String uuid;
    private ElementType elementType;

    public AbstractElement(String uuid, ElementType elementType) {
        this.uuid = uuid;
        this.elementType = elementType;
    }

    public AbstractElement updateFromJson(String jsonString) {
        // TODO

        return null;
    }

    public String convertToJson() {
        // TODO

        return null;
    }

    public abstract void setDefaults();

    public String getUuid() {
        return uuid;
    }

    public ElementType getElementType() {
        return elementType;
    }
}
