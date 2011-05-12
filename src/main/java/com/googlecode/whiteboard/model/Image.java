/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import java.io.Serializable;

public class Image extends AbstractElement implements Serializable
{
    private String url;
    private boolean movedToFront;
    private boolean movedToBack;
    private int rotationDegree;

    public Image() {
        super();
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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
        url = "";
        boolean movedToFront = false;
        boolean movedToBack = false;
        int rotationDegree = 0;
    }
}
