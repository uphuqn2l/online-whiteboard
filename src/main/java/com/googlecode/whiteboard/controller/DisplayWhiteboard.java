/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.model.Whiteboard;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.ActionEvent;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

public class DisplayWhiteboard implements Serializable
{
    private static final long serialVersionUID = 20110501L;

    private Whiteboard whiteboard;
    private boolean pinned;

    public void init(Whiteboard whiteboard) {
        this.whiteboard = whiteboard;
        pinned = true;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public String getTitle() {
        return whiteboard.getTitle();
    }

    public String getCreator() {
        return whiteboard.getCreator();
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

    public int getUsersCount() {
        return whiteboard.getUsers().size();
    }

    public String getMailto() {
        return "mailto:?subject=Invitation%20to%20Whiteboard&amp;body=Hello,%0A%0AI%20would%20like%20to%20invite%20you%20to%20join%20my%20collaborative%20whiteboard.%0A%0AFollow%20this%20link%20please%20" + getInvitationLink() + "%0A%0ARegards.%20" + getCreator() + ".";
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

        return ec.encodeResourceURL(scheme + "://" + ec.getRequestServerName() + serverPort + ec.getRequestContextPath() + "/views/joindialog.jsf?uuid=" + whiteboard.getUuid());
    }

    public String getMonitoringMessage() {
        List<String> users = whiteboard.getUsers();
        if (users.size() < 2) {
            return "User " + getCreator() + " has created this whiteboard.";
        } else {
            return "User " + users.get(users.size() - 1) + " has joined this whiteboard.";
        }
    }

    public void tooglePinUnpin(ActionEvent e) {
         pinned = !pinned;
    }
}
