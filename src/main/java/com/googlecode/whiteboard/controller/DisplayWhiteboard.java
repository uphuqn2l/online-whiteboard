/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.model.Whiteboard;

import javax.annotation.PostConstruct;
import javax.faces.FacesException;
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
    private WhiteboardUuidData whiteboardUuidData;

    @PostConstruct
    protected void initialize() {
        String uuid = (String) FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap().get("uuid");

        if (uuid != null) {
            // we are coming from invite link
            whiteboard = whiteboardsManager.getWhiteboard(uuid);
        } else {
            // we are coming from create dialog
            whiteboard = whiteboardsManager.getWhiteboard(whiteboardUuidData.getUuid());
        }

        if (whiteboard == null) {
            throw new FacesException("Whiteboard object could not be found!");
        }
    }

    public void setWhiteboardsManager(WhiteboardsManager whiteboardsManager) {
        this.whiteboardsManager = whiteboardsManager;
    }

    public void setWhiteboardUuidData(WhiteboardUuidData whiteboardUuidData) {
        this.whiteboardUuidData = whiteboardUuidData;
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
}
