/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.json.JsonConverter;
import com.googlecode.whiteboard.model.Whiteboard;
import com.googlecode.whiteboard.model.attribute.StrokeStyle;
import com.googlecode.whiteboard.model.base.AbstractElement;
import com.googlecode.whiteboard.model.element.*;
import com.googlecode.whiteboard.model.transfer.TransferRestoredElements;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.ActionEvent;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;

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
        SimpleDateFormat dateFormatGmt = new SimpleDateFormat("yyyy-MMM-dd HH:mm:ss");
        dateFormatGmt.setTimeZone(TimeZone.getTimeZone("GMT"));

        return dateFormatGmt.format(new Date()) + " (GMT)";
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
            return "User " + getCreator() + " has created this whiteboard.";
        } else {
            return "User " + users.get(users.size() - 1) + " has joined this whiteboard.";
        }
    }

    public void tooglePinUnpin(ActionEvent e) {
        pinned = !pinned;
    }

    public String getElementsAsJson() {
        // Test
        Circle circle1 = new Circle();
        circle1.setUuid(UUID.randomUUID().toString());
        circle1.setX(100);
        circle1.setY(100);
        circle1.setRotationDegree(0);
        circle1.setRadius(120);
        circle1.setBackgroundColor("#DDDDDD");
        circle1.setBorderColor("#000000");
        circle1.setBorderWidth(3);
        circle1.setBorderStyle(StrokeStyle.Dot.name());
        circle1.setBackgroundOpacity(0.5);
        circle1.setBorderOpacity(0.8);

        FreeLine fLine = new FreeLine();
        fLine.setUuid(UUID.randomUUID().toString());
        fLine.setRotationDegree(10);
        fLine.setPath("M318,121L318,120L319,118L320,116L321,115L322,113L324,110L325,109L326,108L328,106L329,105L331,104L332,103L333,102L334,101L336,100L339,99L339,98L341,98L342,97L344,96L345,96L348,96L350,95L352,95L354,95L355,95L357,95L358,96L359,96L360,96L363,97L364,97L365,98L367,99L370,101L371,102L374,104L375,106L377,108L378,108L379,110L380,111L381,112L382,112L383,113L383,114L385,115L386,116L387,117L388,118L389,119L390,120L391,121L392,122L393,123L394,124L395,124L396,124L398,126L400,126L401,127L402,127L403,127L404,127L405,127L407,127L407,126L408,125L409,125L410,124L411,124L413,123L414,122L415,122L417,121L418,120L419,119L420,119L421,118L422,118L424,117L426,116L427,116L429,114L430,114L431,114L432,113L433,112L435,112L435,111L436,110L438,109L439,108L440,108L441,107L442,106L443,105L444,105L446,104L446,103L448,103L448,102L450,102");
        fLine.setColor("#FF0000");
        fLine.setLineWidth(6);
        fLine.setLineStyle(StrokeStyle.DashDot.name());
        fLine.setOpacity(1.0);

        Text text = new Text();
        text.setText("Hallo Oleg Varaksin!");
        text.setUuid(UUID.randomUUID().toString());
        text.setRotationDegree(90);
        text.setX(300);
        text.setY(300);
        text.setFontFamily("Impact");
        text.setFontSize(40);
        text.setFontWeight("normal");
        text.setFontStyle("italic");
        text.setColor("#F000F0");

        Icon icon = new Icon();
        icon.setUuid(UUID.randomUUID().toString());
        icon.setX(500);
        icon.setY(410);
        icon.setRotationDegree(0);
        icon.setName("snow");
        icon.setScaleFactor(3.5);

        Image image = new Image();
        image.setUuid(UUID.randomUUID().toString());
        image.setX(90);
        image.setY(340);
        image.setRotationDegree(0);
        image.setUrl("http://2.bp.blogspot.com/_r2bVl8CocQo/TCRaFvTt34I/AAAAAAAAACc/a5KMAYbdzpc/S220/olegcv.jpg");
        image.setWidth(95);
        image.setHeight(113);

        whiteboard.addElement(circle1);
        whiteboard.addElement(fLine);
        whiteboard.addElement(text);
        whiteboard.addElement(icon);
        whiteboard.addElement(image);

        if (whiteboard == null || whiteboard.getCount() < 1) {
            // empty whiteboard
            return "";
        }

        TransferRestoredElements tre = new TransferRestoredElements();
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
}
