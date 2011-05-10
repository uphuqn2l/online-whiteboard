/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import com.googlecode.whiteboard.model.enums.Color;
import com.googlecode.whiteboard.model.enums.ElementType;
import com.googlecode.whiteboard.model.enums.StrokeStyle;

import java.io.Serializable;

public class Ellipse extends AbstractElement implements Serializable
{
    private int x;
    private int y;
    private int hRadius;
    private int vRadius;
    private String backgroundColor;
    private String borderColor;
    private int borderWidth;
    private String borderStyle;
    private double backgroundOpacity;
    private double borderOpacity;
    private boolean movedToFront;
    private boolean movedToBack;
    private int rotationDegree;
    private double scaleFactor;

    public Ellipse(String uuid) {
        super(uuid, ElementType.Ellipse);
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getHRadius() {
        return hRadius;
    }

    public void setHRadius(int hRadius) {
        this.hRadius = hRadius;
    }

    public int getVRadius() {
        return vRadius;
    }

    public void setVRadius(int vRadius) {
        this.vRadius = vRadius;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public String getBorderColor() {
        return borderColor;
    }

    public void setBorderColor(String borderColor) {
        this.borderColor = borderColor;
    }

    public int getBorderWidth() {
        return borderWidth;
    }

    public void setBorderWidth(int borderWidth) {
        this.borderWidth = borderWidth;
    }

    public String getBorderStyle() {
        return borderStyle;
    }

    public void setBorderStyle(String borderStyle) {
        this.borderStyle = borderStyle;
    }

    public double getBackgroundOpacity() {
        return backgroundOpacity;
    }

    public void setBackgroundOpacity(double backgroundOpacity) {
        this.backgroundOpacity = backgroundOpacity;
    }

    public double getBorderOpacity() {
        return borderOpacity;
    }

    public void setBorderOpacity(double borderOpacity) {
        this.borderOpacity = borderOpacity;
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

    public double getScaleFactor() {
        return scaleFactor;
    }

    public void setScaleFactor(double scaleFactor) {
        this.scaleFactor = scaleFactor;
    }

    @Override
    public void setDefaults() {
        x = 0;
        y = 0;
        hRadius = 80;
        vRadius = 40;
        backgroundColor = Color.Red.getColor();
        borderColor = Color.Black.getColor();
        borderWidth = 1;
        borderStyle = StrokeStyle.No.getStyle();
        double backgroundOpacity = 1;
        double borderOpacity = 1;
        boolean movedToFront = false;
        boolean movedToBack = false;
        int rotationDegree = 0;
        double scaleFactor = 1;
    }
}
