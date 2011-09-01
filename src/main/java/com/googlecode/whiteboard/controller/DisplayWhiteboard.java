/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.json.JsonConverter;
import com.googlecode.whiteboard.model.Whiteboard;
import com.googlecode.whiteboard.model.base.AbstractElement;
import com.googlecode.whiteboard.model.transfer.RestoredElements;
import com.googlecode.whiteboard.utils.WhiteboardUtils;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.ActionEvent;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

public class DisplayWhiteboard implements Serializable
{
    private static final long serialVersionUID = 20110501L;

    private static final Logger LOG = Logger.getLogger(DisplayWhiteboard.class.getName());

    private Whiteboard whiteboard;
    private WhiteboardsManager whiteboardsManager;
    private String user;
    private boolean pinned;
    private String pubSubTransport;

    public void init(Whiteboard whiteboard, String user, String pubSubTransport) {
        this.whiteboard = whiteboard;
        this.user = user.replace("'", "\\\'");
        this.pubSubTransport = pubSubTransport;
        pinned = true;
    }

    public Whiteboard getWhiteboard() {
        return whiteboard;
    }

    public WhiteboardsManager getWhiteboardsManager() {
        return whiteboardsManager;
    }

    public void setWhiteboardsManager(WhiteboardsManager whiteboardsManager) {
        this.whiteboardsManager = whiteboardsManager;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public String getPubSubTransport() {
        return pubSubTransport;
    }

    public void setPubSubTransport(String pubSubTransport) {
        this.pubSubTransport = pubSubTransport;
    }

    public String getTitle() {
        if (whiteboard == null) {
            return "";
        }

        return whiteboard.getTitle();
    }

    public String getCreator() {
        if (whiteboard == null) {
            return "";
        }

        return whiteboard.getCreator();
    }

    public String getCreationDate() {
        return WhiteboardUtils.formatDate(new Date(), true);
    }

    public int getWidth() {
        if (whiteboard == null) {
            return 0;
        }

        return whiteboard.getWidth();
    }

    public int getHeight() {
        if (whiteboard == null) {
            return 0;
        }

        return whiteboard.getHeight();
    }

    public int getUsersCount() {
        if (whiteboard == null) {
            return 0;
        }

        return whiteboard.getUsers().size();
    }

    public String getMailto() {
        return "mailto:?subject=Invitation%20to%20Whiteboard&amp;body=Hello,%0A%0AI%20would%20like%20to%20invite%20you%20to%20join%20my%20collaborative%20whiteboard.%0A%0AFollow%20this%20link%20please%20" + getInvitationLink() + "%0A%0ARegards.%20" + getCreator() + ".";
    }

    public String getInvitationLink() {
        if (whiteboard == null) {
            return "";
        }

        ExternalContext ec = FacesContext.getCurrentInstance().getExternalContext();
        String scheme = ec.getRequestScheme();
        int port = ec.getRequestServerPort();

        String serverPort;
        if (("http".equalsIgnoreCase(scheme) && port != 80) || ("https".equalsIgnoreCase(scheme) && port != 443)) {
            serverPort = ":" + port;
        } else {
            serverPort = "";
        }

        return ec.encodeResourceURL(scheme + "://" + ec.getRequestServerName() + serverPort + ec.getRequestContextPath() + "/views/joindialog.jsf?uuid=" + whiteboard.getUuid());
    }

    public String getMonitoringMessage() {
        if (whiteboard == null) {
            return "";
        }

        List<String> users = whiteboard.getUsers();
        if (users.size() < 2) {
            return "Hello " + getCreator() + "!. You have created this whiteboard.";
        } else {
            return "Hello " + users.get(users.size() - 1) + "!. You have joined this whiteboard.";
        }
    }

    public void tooglePinUnpin(ActionEvent e) {
        pinned = !pinned;
    }

    public String getElementsAsJson() {
        if (whiteboard == null || whiteboard.getCount() < 1) {
            // empty whiteboard
            return "{}";
        }

        RestoredElements tre = new RestoredElements();
        for (AbstractElement ae : whiteboard.getElements().values()) {
            tre.addElement(ae);
        }

        if (whiteboard.getCount() == 1) {
            tre.setMessage("1 whiteboard element has been restored");
        } else {
            tre.setMessage(whiteboard.getCount() + " whiteboard elements have been restored");
        }

        return JsonConverter.getGson().toJson(tre);
    }

    public String getPubSubUrl() {
        if (whiteboard == null) {
            return "";
        }

        ExternalContext ec = FacesContext.getCurrentInstance().getExternalContext();
        String scheme = ec.getRequestScheme();
        int port = ec.getRequestServerPort();

        String serverPort;
        if (("http".equalsIgnoreCase(scheme) && port != 80) || ("https".equalsIgnoreCase(scheme) && port != 443)) {
            serverPort = ":" + port;
        } else {
            serverPort = "";
        }

        return ec.encodeResourceURL(scheme + "://" + ec.getRequestServerName() + serverPort + ec.getRequestContextPath() + "/pubsub/" + whiteboard.getUuid() + "/" + UUID.randomUUID().toString() + ".topic");
    }
}
