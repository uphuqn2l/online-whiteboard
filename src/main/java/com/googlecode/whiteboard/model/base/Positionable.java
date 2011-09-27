/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.base;

/**
 * Base class of all positionable elements (such elements have coordinates).
 *
 * @author ova / last modified by $Author$
 * @version $Revision$
 */
public abstract class Positionable extends Rotatable
{
    private int x;
    private int y;

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
}
