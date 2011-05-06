/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.model.Whiteboard;
import com.googlecode.whiteboard.utils.FacesAccessor;

import javax.annotation.PostConstruct;
import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

public class CreateWhiteboard implements Serializable
{
    private static final long serialVersionUID = 20110501L;

    private Whiteboard whiteboard;
    private WhiteboardsManager whiteboardsManager;

    @PostConstruct
    protected void initialize() {
        // create an empty whiteboard and uuid container of the current whiteboard 
        whiteboard = new Whiteboard();
    }

    public String getTitle() {
        return whiteboard.getTitle();
    }

    public void setTitle(String title) {
        whiteboard.setTitle(title);
    }

    public String getCreator() {
        return whiteboard.getCreator();
    }

    public void setCreator(String userName) {
        whiteboard.setCreator(userName);
    }

    public int getWidth() {
        return whiteboard.getWidth();
    }

    public void setWidth(int width) {
        whiteboard.setWidth(width);
    }

    public int getHeight() {
        return whiteboard.getHeight();
    }

    public void setHeight(int height) {
        whiteboard.setHeight(height);
    }

    public void setWhiteboardsManager(WhiteboardsManager whiteboardsManager) {
        this.whiteboardsManager = whiteboardsManager;
    }

    public String create() {
        String uuid = UUID.randomUUID().toString();
        whiteboard.setUuid(uuid);
        whiteboard.setCreationDate(new Date());
        whiteboard.addUser(getCreator());
        whiteboardsManager.addWhiteboard(whiteboard);

        DisplayWhiteboard displayWhiteboard = ((DisplayWhiteboard) FacesAccessor.getManagedBean("displayWhiteboard"));
        displayWhiteboard.init(whiteboard);

        return "/views/whiteboard?faces-redirect=true";
    }
}
