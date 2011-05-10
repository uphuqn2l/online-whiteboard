/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import com.googlecode.whiteboard.model.enums.ElementType;

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
    private Date creationDate;
    private List<String> users = new ArrayList<String>();
    private Map<String, AbstractElement> elements = new LinkedHashMap<String, AbstractElement>();
    private Map<ElementType, AbstractElement> defaultProperties = new HashMap<ElementType, AbstractElement>();

    public Whiteboard() {
        AbstractElement ae = new Text(null);
        ae.setDefaults();
        defaultProperties.put(ElementType.Text, ae);

        ae = new FreeLine(null);
        ae.setDefaults();
        defaultProperties.put(ElementType.FreeLine, ae);

        ae = new StraightLine(null);
        ae.setDefaults();
        defaultProperties.put(ElementType.StraightLine, ae);

        ae = new Circle(null);
        ae.setDefaults();
        defaultProperties.put(ElementType.Circle, ae);

        ae = new Ellipse(null);
        ae.setDefaults();
        defaultProperties.put(ElementType.Ellipse, ae);

        ae = new Rectangle(null);
        ae.setDefaults();
        defaultProperties.put(ElementType.Rectangle, ae);

        ae = new Image(null);
        ae.setDefaults();
        defaultProperties.put(ElementType.Image, ae);

        ae = new Icon(null);
        ae.setDefaults();
        defaultProperties.put(ElementType.Icon, ae);
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

    public void addElement(String uuid, AbstractElement element) {
        elements.put(uuid, element);
    }

    public AbstractElement getElement(String uuid) {
        return elements.get(uuid);
    }

    public Map<ElementType, AbstractElement> getDefaultProperties() {
        return defaultProperties;
    }

    public void updateDefaultProperty(ElementType elementType, AbstractElement element) {
        defaultProperties.put(elementType, element);
    }
}
