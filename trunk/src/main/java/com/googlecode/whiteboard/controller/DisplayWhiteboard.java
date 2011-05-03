/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.errorhandler.DefaultExceptionHandler;
import com.googlecode.whiteboard.model.Whiteboard;

import javax.annotation.PostConstruct;
import javax.faces.context.FacesContext;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class DisplayWhiteboard implements Serializable
{
    private static final long serialVersionUID = 20110501L;

    private Whiteboard whiteboard;
    private WhiteboardsManager whiteboardsManager;

    @PostConstruct
    protected void initialize() {
        String uuid = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap().get("uuid");

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

    public void setWhiteboardsManager(WhiteboardsManager whiteboardsManager) {
        this.whiteboardsManager = whiteboardsManager;
    }

    public String getTitle() {
        return whiteboard.getTitle();
    }

    public String getUserName() {
        return whiteboard.getUserName();
    }

    public String getCreationDate() {
        SimpleDateFormat dateFormatGmt = new SimpleDateFormat("yyyy-MMM-dd HH:mm:ss");
        dateFormatGmt.setTimeZone(TimeZone.getTimeZone("GMT"));

        return dateFormatGmt.format(new Date()) + " (GMT)";
    }

    public int getWidth() {
        return whiteboard.getWidth();
    }

    public int getHeight() {
        return whiteboard.getHeight();
    }

    public int getActiveUsers() {
        // TODO
        return 1;
    }
}
