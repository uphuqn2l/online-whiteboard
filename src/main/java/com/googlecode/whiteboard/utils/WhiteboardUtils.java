/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.utils;

import com.googlecode.whiteboard.controller.DisplayWhiteboard;
import com.googlecode.whiteboard.json.JsonConverter;
import com.googlecode.whiteboard.model.Whiteboard;
import com.googlecode.whiteboard.model.base.AbstractElement;
import com.googlecode.whiteboard.model.base.Line;
import com.googlecode.whiteboard.model.base.Positionable;
import com.googlecode.whiteboard.model.element.FreeLine;
import com.googlecode.whiteboard.model.element.StraightLine;
import com.googlecode.whiteboard.model.element.Text;
import com.googlecode.whiteboard.model.transfer.*;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.logging.Logger;

public class WhiteboardUtils
{
    private static final Logger LOG = Logger.getLogger(WhiteboardUtils.class.getName());

    public static String formatDate(Date date, boolean isLocal) {
        SimpleDateFormat dateFormatGmt = new SimpleDateFormat("yyyy-MMM-dd HH:mm:ss");
        if (isLocal) {
            dateFormatGmt.setTimeZone(TimeZone.getTimeZone("GMT"));
        }

        return dateFormatGmt.format(date) + " (GMT)";
    }

    public static synchronized String updateWhiteboardFromJson(HttpServletRequest request, String transferedJsonData) {
        if (request == null) {
            LOG.severe("Current HTTP request not found (null) ==> no whiteboard update!");
            return "";
        }

        // get DisplayWhiteboard bean
        DisplayWhiteboard dw = (DisplayWhiteboard) request.getSession().getAttribute("displayWhiteboard");
        if (dw == null) {
            LOG.severe("Managed bean DisplayWhiteboard not found (null) ==> no whiteboard update!");
            return "";
        }

        ServerChangedData scd = null;
        Whiteboard whiteboard = dw.getWhiteboard();

        // create Java object from JSON with all changed data
        ClientChangedData ccd = JsonConverter.getGson().fromJson(transferedJsonData, ClientChangedData.class);
        ccd.setUser(dw.getUser());

        switch (ccd.getAction()) {
            case Create:
                scd = WhiteboardUtils.createElement(whiteboard, ccd);
                break;
            case Remove:
                scd = WhiteboardUtils.removeElement(whiteboard, ccd);
                break;
            case Clone:
                scd = WhiteboardUtils.cloneElement(whiteboard, ccd);
                break;
            case Move:
                scd = WhiteboardUtils.moveElement(whiteboard, ccd);
                break;
            case BringToFront:
                scd = WhiteboardUtils.bringToFront(whiteboard, ccd);
                break;
            case BringToBack:
                scd = WhiteboardUtils.bringToBack(whiteboard, ccd);
                break;
            case Clear:
                scd = WhiteboardUtils.clearWhiteboard(whiteboard, ccd);
                break;
            case Resize:
                scd = WhiteboardUtils.resizeWhiteboard(whiteboard, ccd);
                break;
            default:
                LOG.warning("Unknown client action!");
                break;
        }

        // update changed whiteboard
        dw.getWhiteboardsManager().updateWhiteboard(whiteboard);

        if (scd == null) {
            return "";
        }

        // generate output JSON for subscribed clients
        return JsonConverter.getGson().toJson(scd);
    }

    private static ServerChangedData createElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Create element: element is null");
            return null;
        }

        whiteboard.addElement(ccd.getElement());

        ServerChangedData scd = new ServerChangedData();
        scd.setAction(ccd.getAction());
        scd.setElement(ccd.getElement());

        StringBuffer message = new StringBuffer();
        message.append("Timestamp: ");
        message.append(WhiteboardUtils.formatDate(new Date(ccd.getTimestamp()), false));
        message.append(", User: ");
        message.append(ccd.getUser());
        message.append(", Action: created ");
        message.append(getTextForElement(ccd.getElement()));
        if (ccd.getElement() instanceof Positionable) {
            message.append(" at position ");
            message.append("(");
            message.append(((Positionable) ccd.getElement()).getX());
            message.append(",");
            message.append(((Positionable) ccd.getElement()).getY());
            message.append(")");
        }

        scd.setMessage(message.toString());

        return scd;
    }

    private static ServerChangedData removeElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Remove element: element is null");
            return null;
        }

        AbstractElement ae = whiteboard.removeElement(ccd.getElement());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return null;
        }

        ServerChangedData scd = new ServerChangedData();
        scd.setAction(ccd.getAction());
        AbstractElement ccdElement = ccd.getElement();
        scd.setElement(new TruncatedElement(ccdElement.getUuid(), ccdElement.getClass().getSimpleName()));

        StringBuffer message = new StringBuffer();
        message.append("Timestamp: ");
        message.append(WhiteboardUtils.formatDate(new Date(ccd.getTimestamp()), false));
        message.append(", User: ");
        message.append(ccd.getUser());
        message.append(", Action: removed ");
        message.append(getTextForElement(ae));
        if (ae instanceof Positionable) {
            message.append(" at position ");
            message.append("(");
            message.append(((Positionable) ae).getX());
            message.append(",");
            message.append(((Positionable) ae).getY());
            message.append(")");
        }

        scd.setMessage(message.toString());

        return scd;
    }

    private static ServerChangedData cloneElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Clone element: element is null");
            return null;
        }

        whiteboard.addElement(ccd.getElement());

        ServerChangedData scd = new ServerChangedData();
        scd.setAction(ccd.getAction());
        scd.setElement(ccd.getElement());

        StringBuffer message = new StringBuffer();
        message.append("Timestamp: ");
        message.append(WhiteboardUtils.formatDate(new Date(ccd.getTimestamp()), false));
        message.append(", User: ");
        message.append(ccd.getUser());
        message.append(", Action: cloned ");
        message.append(getTextForElement(ccd.getElement()));
        if (ccd.getElement() instanceof Positionable) {
            message.append(" at position ");
            message.append("(");
            message.append(((Positionable) ccd.getElement()).getX());
            message.append(",");
            message.append(((Positionable) ccd.getElement()).getY());
            message.append(")");
        }

        scd.setMessage(message.toString());

        return scd;
    }

    private static ServerChangedData moveElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Move element: element is null");
            return null;
        }

        AbstractElement ae = whiteboard.getElement(ccd.getElement().getUuid());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return null;
        }

        String position = null;
        AbstractElement ccdElement = ccd.getElement();
        TruncatedElement tElement = null;

        if (ae instanceof Positionable) {
            int posX = ((Positionable) ccdElement).getX();
            int posY = ((Positionable) ccdElement).getY();
            ((Positionable) ae).setX(posX);
            ((Positionable) ae).setY(posY);
            position = "(" + posX + "," + posY + ")";
            tElement = new TruncatedPositionable(ccdElement.getUuid(), ccdElement.getClass().getSimpleName(), posX, posY);
        } else if (ae instanceof Line) {
            String path = ((Line) ccdElement).getPath();
            ((Line) ae).setPath(path);
            tElement = new TruncatedLine(ccdElement.getUuid(), ccdElement.getClass().getSimpleName(), path);
        }

        ServerChangedData scd = new ServerChangedData();
        scd.setAction(ccd.getAction());
        scd.setElement(tElement);

        StringBuffer message = new StringBuffer();
        message.append("Timestamp: ");
        message.append(WhiteboardUtils.formatDate(new Date(ccd.getTimestamp()), false));
        message.append(", User: ");
        message.append(ccd.getUser());
        message.append(", Action: moved ");
        message.append(getTextForElement(ae));
        if (position != null) {
            message.append(" to position ");
            message.append(position);
        }

        scd.setMessage(message.toString());

        return scd;
    }

    private static ServerChangedData bringToFront(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Bring to top: element is null");
            return null;
        }

        AbstractElement ae = whiteboard.removeElement(ccd.getElement());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return null;
        }

        whiteboard.addElement(ae);

        ServerChangedData scd = new ServerChangedData();
        scd.setAction(ccd.getAction());
        AbstractElement ccdElement = ccd.getElement();
        scd.setElement(new TruncatedElement(ccdElement.getUuid(), ccdElement.getClass().getSimpleName()));

        StringBuffer message = new StringBuffer();
        message.append("Timestamp: ");
        message.append(WhiteboardUtils.formatDate(new Date(ccd.getTimestamp()), false));
        message.append(", User: ");
        message.append(ccd.getUser());
        message.append(", Action: brought ");
        message.append(getTextForElement(ae));
        message.append(" to front (in front of other elements)");
        if (ae instanceof Positionable) {
            message.append(" at position ");
            message.append("(");
            message.append(((Positionable) ae).getX());
            message.append(",");
            message.append(((Positionable) ae).getY());
            message.append(")");
        }

        scd.setMessage(message.toString());

        return scd;
    }

    private static ServerChangedData bringToBack(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Bring to back: element is null");
            return null;
        }

        AbstractElement ae = whiteboard.removeElement(ccd.getElement());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return null;
        }

        Map<String, AbstractElement> elements = new LinkedHashMap<String, AbstractElement>();
        elements.put(ae.getUuid(), ae);
        elements.putAll(whiteboard.getElements());
        whiteboard.setElements(elements);

        ServerChangedData scd = new ServerChangedData();
        scd.setAction(ccd.getAction());
        AbstractElement ccdElement = ccd.getElement();
        scd.setElement(new TruncatedElement(ccdElement.getUuid(), ccdElement.getClass().getSimpleName()));

        StringBuffer message = new StringBuffer();
        message.append("Timestamp: ");
        message.append(WhiteboardUtils.formatDate(new Date(ccd.getTimestamp()), false));
        message.append(", User: ");
        message.append(ccd.getUser());
        message.append(", Action: brought ");
        message.append(getTextForElement(ae));
        message.append(" to back (behind other elements)");
        if (ae instanceof Positionable) {
            message.append(" at position ");
            message.append("(");
            message.append(((Positionable) ae).getX());
            message.append(",");
            message.append(((Positionable) ae).getY());
            message.append(")");
        }

        scd.setMessage(message.toString());

        return scd;
    }

    private static ServerChangedData clearWhiteboard(Whiteboard whiteboard, ClientChangedData ccd) {
        whiteboard.clearElements();

        ServerChangedData scd = new ServerChangedData();
        scd.setAction(ccd.getAction());
        AbstractElement ccdElement = ccd.getElement();
        scd.setElement(new TruncatedElement(ccdElement.getUuid(), ccdElement.getClass().getSimpleName()));

        StringBuffer message = new StringBuffer();
        message.append("Timestamp: ");
        message.append(WhiteboardUtils.formatDate(new Date(ccd.getTimestamp()), false));
        message.append(", User: ");
        message.append(ccd.getUser());
        message.append(", Action: cleared this Whiteboard");

        scd.setMessage(message.toString());

        return scd;
    }

    private static ServerChangedData resizeWhiteboard(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getParameters() == null || ccd.getParameters().isEmpty()) {
            LOG.warning("Resize whiteboard: no parameters passed");
            return null;
        }

        int width = Integer.valueOf(ccd.getParameters().get("width"));
        int height = Integer.valueOf(ccd.getParameters().get("height"));
        whiteboard.setWidth(width);
        whiteboard.setHeight(height);

        ServerChangedData scd = new ServerChangedData();
        scd.setAction(ccd.getAction());
        AbstractElement ccdElement = ccd.getElement();
        scd.setElement(new TruncatedElement(ccdElement.getUuid(), ccdElement.getClass().getSimpleName()));

        scd.addParameter("width", ccd.getParameters().get("width"));
        scd.addParameter("height", ccd.getParameters().get("height"));

        StringBuffer message = new StringBuffer();
        message.append("Timestamp: ");
        message.append(WhiteboardUtils.formatDate(new Date(ccd.getTimestamp()), false));
        message.append(", User: ");
        message.append(ccd.getUser());
        message.append(", Action: resized this Whiteboard to (");
        message.append(width);
        message.append(",");
        message.append(height);
        message.append(") px");

        scd.setMessage(message.toString());

        return scd;
    }

    private static String getTextForElement(AbstractElement ae) {
        if (ae instanceof Text) {
            return "Text '" + ((Text) ae).getText() + "'";
        } else if (ae instanceof FreeLine) {
            return "Free Line";
        } else if (ae instanceof StraightLine) {
            return "Straight Line";
        } else {
            return ae.getClass().getSimpleName();
        }
    }
}
