/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

public abstract class AbstractElement
{
    private String uuid;
    private String elementType;

    public AbstractElement(String uuid, String elementType) {
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

    public String getElementType() {
        return elementType;
    }
}
