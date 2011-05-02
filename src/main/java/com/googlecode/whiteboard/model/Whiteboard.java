/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Whiteboard implements Serializable
{
    private static final long serialVersionUID = 20110501L;

    private String uuid;
    private String title;
    private String userName;
    private int width = 800;
    private int height = 600;
    private Date creationDate;
    private Map<String, AbstractElement> elements = new HashMap<String, AbstractElement>();

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public void addElement(String uuid, AbstractElement element) {
        elements.put(uuid, element);
    }

    public AbstractElement getElement(String uuid) {
        return elements.get(uuid);
    }
}
