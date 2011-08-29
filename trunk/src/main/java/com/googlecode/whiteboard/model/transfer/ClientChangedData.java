/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.transfer;

import com.googlecode.whiteboard.model.base.AbstractElement;

import java.util.HashMap;
import java.util.Map;

public class ClientChangedData
{
    private ClientAction action;
    private AbstractElement element;
    private String user;
    private long timestamp;
    private Map<String, Object> parameters = new HashMap<String, Object>();

    public ClientAction getAction() {
        return action;
    }

    public void setAction(ClientAction action) {
        this.action = action;
    }

    public AbstractElement getElement() {
        return element;
    }

    public void setElement(AbstractElement element) {
        this.element = element;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }

    public void setParameters(Map<String, Object> parameters) {
        this.parameters = parameters;
    }
}
