/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import com.googlecode.whiteboard.model.base.AbstractElement;

import java.io.Serializable;
import java.util.*;

public class Whiteboard implements Serializable
{
    private static final long serialVersionUID = 20110506L;

    private String uuid;
    private String title;
    private String creator;
    private int width = 800;
    private int height = 500;
    private Date creationDate = new Date();
    private List<String> users = new ArrayList<String>();
    private Map<String, AbstractElement> elements = new LinkedHashMap<String, AbstractElement>();

    public Whiteboard() {
        uuid = UUID.randomUUID().toString();
    }

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

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
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

    public void addUser(String user) {
        users.add(user);
    }

    public List<String> getUsers() {
        return users;
    }

    public void addElement(AbstractElement element) {
        elements.put(element.getUuid(), element);
    }

    public AbstractElement getElement(String uuid) {
        return elements.get(uuid);
    }
}
