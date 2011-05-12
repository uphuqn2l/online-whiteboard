/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import com.googlecode.whiteboard.model.enums.Color;
import com.googlecode.whiteboard.model.enums.FontStyle;
import com.googlecode.whiteboard.model.enums.FontWeight;

import java.io.Serializable;

public class Text extends AbstractElement implements Serializable
{
    private String fontFamily;
    private int fontSize;
    private String fontWeight;
    private String fontStyle;
    private String color;
    private boolean movedToFront;
    private boolean movedToBack;
    private int rotationDegree;

    public Text() {
        super();
    }

    public String getFontFamily() {
        return fontFamily;
    }

    public void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
    }

    public int getFontSize() {
        return fontSize;
    }

    public void setFontSize(int fontSize) {
        this.fontSize = fontSize;
    }

    public String getFontWeight() {
        return fontWeight;
    }

    public void setFontWeight(String fontWeight) {
        this.fontWeight = fontWeight;
    }

    public String getFontStyle() {
        return fontStyle;
    }

    public void setFontStyle(String fontStyle) {
        this.fontStyle = fontStyle;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isMovedToFront() {
        return movedToFront;
    }

    public void setMovedToFront(boolean movedToFront) {
        this.movedToFront = movedToFront;
    }

    public boolean isMovedToBack() {
        return movedToBack;
    }

    public void setMovedToBack(boolean movedToBack) {
        this.movedToBack = movedToBack;
    }

    public int getRotationDegree() {
        return rotationDegree;
    }

    public void setRotationDegree(int rotationDegree) {
        this.rotationDegree = rotationDegree;
    }

    @Override
    public void setDefaults() {
        fontFamily = "Verdana";
        fontSize = 18;
        fontWeight = FontWeight.Normal.getWeight();
        fontStyle = FontStyle.Normal.getStyle();
        color = Color.Black.getColor();
        boolean movedToFront = false;
        boolean movedToBack = false;
        int rotationDegree = 0;
    }
}
