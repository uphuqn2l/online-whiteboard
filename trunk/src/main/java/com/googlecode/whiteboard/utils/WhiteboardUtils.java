/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.utils;

import com.googlecode.whiteboard.model.Whiteboard;
import com.googlecode.whiteboard.model.base.AbstractElement;
import com.googlecode.whiteboard.model.base.Line;
import com.googlecode.whiteboard.model.base.Positionable;
import com.googlecode.whiteboard.model.transfer.ClientChangedData;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.logging.Logger;

public class WhiteboardUtils
{
    private static final Logger LOG = Logger.getLogger(WhiteboardUtils.class.getName());

    public static synchronized Whiteboard updateFromJson(Whiteboard whiteboard, String jsonString) {
        // TODO
        // if new element ==> create it first and add to the whiteboard
        // call updateFromJson(String jsonString) on the element

        return null;
    }

    public static String formatDate(Date date, boolean isLocal) {
        SimpleDateFormat dateFormatGmt = new SimpleDateFormat("yyyy-MMM-dd HH:mm:ss");
        if (isLocal) {
            dateFormatGmt.setTimeZone(TimeZone.getTimeZone("GMT"));
        }

        return dateFormatGmt.format(date) + " (GMT)";
    }

    public static synchronized void createElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Create element: element is null");
        }

        whiteboard.addElement(ccd.getElement());
    }

    public static synchronized void removeElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Remove element: element is null");
        }

        whiteboard.removeElement(ccd.getElement());
    }

    public static synchronized void cloneElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Clone element: element is null");
        }

        whiteboard.addElement(ccd.getElement());
    }

    public static synchronized void moveElement(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Move element: element is null");
        }

        AbstractElement ae = whiteboard.getElement(ccd.getElement().getUuid());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return;
        }

        if (ae instanceof Positionable) {
            ((Positionable) ae).setX(((Positionable) ccd.getElement()).getX());
            ((Positionable) ae).setY(((Positionable) ccd.getElement()).getY());
        } else if (ae instanceof Line) {
            ((Line) ae).setPath(((Line) ccd.getElement()).getPath());
        }
    }

    public static synchronized void bringToFront(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Bring to top: element is null");
        }

        AbstractElement ae = whiteboard.removeElement(ccd.getElement());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return;
        }

        whiteboard.addElement(ae);
    }

    public static synchronized void bringToBack(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getElement() == null) {
            LOG.warning("Bring to back: element is null");
        }

        AbstractElement ae = whiteboard.removeElement(ccd.getElement());
        if (ae == null) {
            // element doesn't exist more in this whiteboard
            return;
        }

        Map<String, AbstractElement> elements = new LinkedHashMap<String, AbstractElement>();
        elements.put(ae.getUuid(), ae);
        elements.putAll(whiteboard.getElements());
        whiteboard.setElements(elements);
    }

    public static synchronized void clearWhiteboard(Whiteboard whiteboard, ClientChangedData ccd) {
        whiteboard.clearElements();
    }

    public static synchronized void resizeWhiteboard(Whiteboard whiteboard, ClientChangedData ccd) {
        if (ccd.getParameters() == null || ccd.getParameters().isEmpty()) {
            LOG.warning("Resize whiteboard: no parameters passed");
        }

        whiteboard.setWidth(Integer.valueOf(ccd.getParameters().get("width")));
        whiteboard.setHeight(Integer.valueOf(ccd.getParameters().get("height")));
    }
}
