/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import java.io.Serializable;

public class Icon extends AbstractElement implements Serializable
{
    private String name;
    private boolean movedToFront;
    private boolean movedToBack;
    private int rotationDegree;

    public Icon() {
        super();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
        name = "";
        boolean movedToFront = false;
        boolean movedToBack = false;
        int rotationDegree = 0;
    }
}
