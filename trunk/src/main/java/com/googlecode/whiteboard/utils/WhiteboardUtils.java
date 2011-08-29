/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.utils;

import com.googlecode.whiteboard.controller.WhiteboardsManager;
import com.googlecode.whiteboard.model.Whiteboard;
import com.googlecode.whiteboard.model.transfer.ClientChangedData;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class WhiteboardUtils
{
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

    public static void createElement(WhiteboardsManager whiteboardsManager, Whiteboard whiteboard, ClientChangedData ccd) {
        whiteboard.addElement(ccd.getElement());
        whiteboardsManager.updateWhiteboard(whiteboard);
    }

    public static void removeElement(WhiteboardsManager whiteboardsManager, Whiteboard whiteboard, ClientChangedData ccd) {
        whiteboard.removeElement(ccd.getElement());
        whiteboardsManager.updateWhiteboard(whiteboard);
    }
}
