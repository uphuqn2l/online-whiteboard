/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.errorhandler.DefaultExceptionHandler;
import com.googlecode.whiteboard.model.AbstractElement;
import com.googlecode.whiteboard.model.Whiteboard;

import javax.annotation.PostConstruct;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.ActionEvent;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class DisplayWhiteboard implements Serializable
{
    private static final long serialVersionUID = 20110501L;

    private Whiteboard whiteboard;
    private WhiteboardsManager whiteboardsManager;
    private String toolboxButtonId = "btnNo";
    private AbstractElement selectedElement;

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

    public String getInvitationLink() {
        ExternalContext ec = FacesContext.getCurrentInstance().getExternalContext();
        String scheme = ec.getRequestScheme();
        int port = ec.getRequestServerPort();

        String serverPort;
        if (("http".equalsIgnoreCase(scheme) && port != 80) || ("https".equalsIgnoreCase(scheme) && port != 443)) {
            serverPort = ":" + port;
        } else {
            serverPort = "";
        }

        return ec.encodeResourceURL(scheme + "://" + ec.getRequestServerName() + serverPort + ec.getRequestContextPath() + "/views/whiteboard.jsf?uuid=" + whiteboard.getUuid());
    }

    public AbstractElement getSelectedElement() {
        return selectedElement;
    }

    public void setSelectedElement(AbstractElement selectedElement) {
        this.selectedElement = selectedElement;
    }

    public void selectToolboxItem(ActionEvent ae) {
        toolboxButtonId = ae.getComponent().getId();

        if (toolboxButtonId.equals("btnClone")) {
            // clone selected element if any exists and show it in edit or show 'no element selected'
            // TODO
        } else if (toolboxButtonId.equals("btnRemove")) {
            // remove selected element and show 'no selection' if any exists or 'no element selected'
            // TODO
        } else if (toolboxButtonId.equals("btnClearWb")) {
            // clear whiteboard and show 'no selection'
            // TODO
        } else if (toolboxButtonId.equals("btnResizeWb")) {
            // resize whiteboard
            // TODO
        }
    }

    public boolean isToolboxItemSelected(String itemId) {
        return toolboxButtonId.equals(itemId);
    }
}
