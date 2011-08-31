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
import com.googlecode.whiteboard.model.transfer.ClientChangedData;

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
        //System.out.println(transferedJsonData);
        if (request == null) {
            LOG.severe("Current HTTP request not found (null) ==> no whiteboard update!");
            return "{}";
        }

        String message = null;

        // get DisplayWhiteboard bean
        DisplayWhiteboard dw = (DisplayWhiteboard) request.getSession().getAttribute("beanName");
        if (dw == null) {
            LOG.severe("DisplayWhiteboard not found (null) ==> no whiteboard update!");
            return "{}";
        }

        Whiteboard whiteboard = dw.getWhiteboard();

        // create Java object with all changed data
        ClientChangedData ccd = JsonConverter.getGson().fromJson(transferedJsonData, ClientChangedData.class);
        ccd.setUser(dw.getUser());

        switch (ccd.getAction()) {
            case Create:
                message = WhiteboardUtils.createElement(whiteboard, ccd);
                break;
            case Remove:
                message = WhiteboardUtils.removeElement(whiteboard, ccd);
                break;
            case Clone:
                message = WhiteboardUtils.cloneElement(whiteboard, ccd);
                break;
            case Move:
                message = WhiteboardUtils.moveElement(whiteboard, ccd);
                break;
            case BringToFront:
                message = WhiteboardUtils.bringToFront(whiteboard, ccd);
                break;
            case BringToBack:
                message = WhiteboardUtils.bringToBack(whiteboard, ccd);
                break;
            case Clear:
                message = WhiteboardUtils.clearWhiteboard(whiteboard, ccd);
                break;
            case Resize:
                message = WhiteboardUtils.resizeWhiteboard(whiteboard, ccd);
                break;
            default:
                LOG.warning("Unknown client action!");
                break;
        }

        // update changed whiteboard
        dw.getWhiteboardsManager().updateWhiteboard(whiteboard);

        return message;

        //WhiteboardUtils.formatDate(new Date(ccd.getTimestamp()), false)
    }

    private static String createElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Create element: element is null");
        }

        whiteboard.addElement(ccd.getElement());

        return "TODO";
    }

    private static String removeElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Remove element: element is null");
        }

        whiteboard.removeElement(ccd.getElement());

        return "TODO";

    }

    private static String cloneElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Clone element: element is null");
        }

        whiteboard.addElement(ccd.getElement());

        return "TODO";
    }

    private static String moveElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Move element: element is null");
        }

        AbstractElement ae = whiteboard.getElement(ccd.getElement().getUuid());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return "{}";
        }

        if (ae instanceof Positionable) {
            ((Positionable) ae).setX(((Positionable) ccd.getElement()).getX());
            ((Positionable) ae).setY(((Positionable) ccd.getElement()).getY());
        } else if (ae instanceof Line) {
            ((Line) ae).setPath(((Line) ccd.getElement()).getPath());
        }

        return "TODO";
    }

    private static String bringToFront(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Bring to top: element is null");
        }

        AbstractElement ae = whiteboard.removeElement(ccd.getElement());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return "{}";
        }

        whiteboard.addElement(ae);

        return "TODO";
    }

    private static String bringToBack(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Bring to back: element is null");
        }

        AbstractElement ae = whiteboard.removeElement(ccd.getElement());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return "{}";
        }

        Map<String, AbstractElement> elements = new LinkedHashMap<String, AbstractElement>();
        elements.put(ae.getUuid(), ae);
        elements.putAll(whiteboard.getElements());
        whiteboard.setElements(elements);

        return "TODO";
    }

    private static String clearWhiteboard(Whiteboard whiteboard, ClientChangedData ccd) {
        whiteboard.clearElements();

        return "TODO";
    }

    private static String resizeWhiteboard(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getParameters() == null || ccd.getParameters().isEmpty()) {
            LOG.warning("Resize whiteboard: no parameters passed");
        }

        whiteboard.setWidth(Integer.valueOf(ccd.getParameters().get("width")));
        whiteboard.setHeight(Integer.valueOf(ccd.getParameters().get("height")));

        return "TODO";
    }
}
