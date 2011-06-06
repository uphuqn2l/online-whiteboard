/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.model.Whiteboard;
import com.googlecode.whiteboard.utils.FacesAccessor;

import javax.annotation.PostConstruct;
import javax.faces.model.SelectItem;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class CreateWhiteboard implements Serializable
{
    private static final long serialVersionUID = 20110501L;

    private Whiteboard whiteboard;
    private WhiteboardsManager whiteboardsManager;
    private List<SelectItem> fontFamilies;

    @PostConstruct
    protected void initialize() {
        // create an empty whiteboard and uuid container of the current whiteboard 
        whiteboard = new Whiteboard();
    }

    public String getTitle() {
        return whiteboard.getTitle();
    }

    public void setTitle(String title) {
        whiteboard.setTitle(title);
    }

    public String getCreator() {
        return whiteboard.getCreator();
    }

    public void setCreator(String userName) {
        whiteboard.setCreator(userName);
    }

    public int getWidth() {
        return whiteboard.getWidth();
    }

    public void setWidth(int width) {
        whiteboard.setWidth(width);
    }

    public int getHeight() {
        return whiteboard.getHeight();
    }

    public void setHeight(int height) {
        whiteboard.setHeight(height);
    }

    public void setWhiteboardsManager(WhiteboardsManager whiteboardsManager) {
        this.whiteboardsManager = whiteboardsManager;
    }

    public String create() {
        whiteboard.setCreationDate(new Date());
        whiteboard.addUser(getCreator());
        whiteboardsManager.addWhiteboard(whiteboard);

        DisplayWhiteboard displayWhiteboard = ((DisplayWhiteboard) FacesAccessor.getManagedBean("displayWhiteboard"));
        displayWhiteboard.init(whiteboard);

        return "/views/whiteboard?faces-redirect=true";
    }

    public List getFontFamilies() {
        if (fontFamilies == null) {
            fontFamilies = new ArrayList<SelectItem>();
            fontFamilies.add(new SelectItem("\"Arial\"", "Arial"));
            fontFamilies.add(new SelectItem("\"Arial Black\"", "Arial Black"));
            fontFamilies.add(new SelectItem("\"Book Antiqua\"", "Book Antiqua"));
            fontFamilies.add(new SelectItem("\"Century Gothic\"", "Century Gothic"));
            fontFamilies.add(new SelectItem("\"Comic Sans MS\"", "Comic Sans MS"));
            fontFamilies.add(new SelectItem("\"Courier\"", "Courier"));
            fontFamilies.add(new SelectItem("\"Courier New\"", "Courier New"));
            fontFamilies.add(new SelectItem("\"Garamond\"", "Garamond"));
            fontFamilies.add(new SelectItem("\"Geneva\"", "Geneva"));
            fontFamilies.add(new SelectItem("\"Georgia\"", "Georgia"));
            fontFamilies.add(new SelectItem("\"Helvetica\"", "Helvetica"));
            fontFamilies.add(new SelectItem("\"Impact\"", "Impact"));
            fontFamilies.add(new SelectItem("\"Lucida Console\"", "Lucida Console"));
            fontFamilies.add(new SelectItem("\"Lucida Sans Unicode\"", "Lucida Sans Unicode"));
            fontFamilies.add(new SelectItem("\"Palatino Linotype\"", "Palatino Linotype"));
            fontFamilies.add(new SelectItem("\"sans-serif\"", "Sans-Serif"));
            fontFamilies.add(new SelectItem("\"Tahoma\"", "Tahoma"));
            fontFamilies.add(new SelectItem("\"Times New Roman\"", "Times New Roman"));
            fontFamilies.add(new SelectItem("\"Trebuchet MS\"", "Trebuchet MS"));
            fontFamilies.add(new SelectItem("\"Verdana\"", "Verdana"));
        }

        return fontFamilies;
    }
}
