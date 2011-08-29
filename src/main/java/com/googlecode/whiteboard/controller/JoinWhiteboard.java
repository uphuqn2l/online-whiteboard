/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.errorhandler.DefaultExceptionHandler;
import com.googlecode.whiteboard.model.Whiteboard;
import com.googlecode.whiteboard.utils.FacesAccessor;

import javax.annotation.PostConstruct;
import javax.faces.context.FacesContext;
import java.io.Serializable;

public class JoinWhiteboard implements Serializable
{
    private static final long serialVersionUID = 20110506L;

    private String user = "";
    private Whiteboard whiteboard;
    private WhiteboardsManager whiteboardsManager;

    @PostConstruct
    protected void initialize() {
        String uuid = FacesAccessor.getRequestParameter("uuid");

        if (uuid != null) {
            whiteboard = whiteboardsManager.getWhiteboard(uuid);
        } else {
            DefaultExceptionHandler.doRedirect(FacesContext.getCurrentInstance(), "/views/error.jsf?statusCode=601");
            return;
        }

        if (whiteboard == null) {
            DefaultExceptionHandler.doRedirect(FacesContext.getCurrentInstance(), "/views/error.jsf?statusCode=602");
        }
    }

    public String getTitle() {
        if (whiteboard == null) {
            return "";
        }

        return whiteboard.getTitle();
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setWhiteboardsManager(WhiteboardsManager whiteboardsManager) {
        this.whiteboardsManager = whiteboardsManager;
    }

    public String join() {
        whiteboard.addUser(user);
        whiteboardsManager.updateWhiteboard(whiteboard);

        DisplayWhiteboard displayWhiteboard = ((DisplayWhiteboard) FacesAccessor.getManagedBean("displayWhiteboard"));
        displayWhiteboard.init(whiteboard, user);

        return "/views/whiteboard?faces-redirect=true";
    }
}
