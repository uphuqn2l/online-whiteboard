/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.transfer;

import com.googlecode.whiteboard.model.base.AbstractElement;

import java.util.ArrayList;
import java.util.List;

public class TransferRestoredElements
{
    private List<AbstractElement> elements = new ArrayList<AbstractElement>();
    private String message;

    public List<AbstractElement> getElements() {
        return elements;
    }

    public void setElements(List<AbstractElement> elements) {
        this.elements = elements;
    }

    public void addElement(AbstractElement element) {
        this.elements.add(element);
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
