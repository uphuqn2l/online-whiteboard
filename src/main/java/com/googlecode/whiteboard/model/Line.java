/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import com.googlecode.whiteboard.model.enums.Color;
import com.googlecode.whiteboard.model.enums.StrokeStyle;

public abstract class Line extends AbstractElement
{
    private String color;
    private int lineWidth;
    private String lineStyle;
    private double opacity;
    private boolean movedToFront;
    private boolean movedToBack;
    private int rotationDegree;
    private double scaleFactor;

    public Line() {
        super();
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getLineWidth() {
        return lineWidth;
    }

    public void setLineWidth(int lineWidth) {
        this.lineWidth = lineWidth;
    }

    public String getLineStyle() {
        return lineStyle;
    }

    public void setLineStyle(String lineStyle) {
        this.lineStyle = lineStyle;
    }

    public double getOpacity() {
        return opacity;
    }

    public void setOpacity(double opacity) {
        this.opacity = opacity;
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
        color = Color.Black.getColor();
        lineWidth = 1;
        lineStyle = StrokeStyle.No.getStyle();
        double opacity = 1.0;
        boolean movedToFront = false;
        boolean movedToBack = false;
        int rotationDegree = 0;
        double scaleFactor = 1.0;
    }
}
