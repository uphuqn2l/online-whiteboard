/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.transfer;

public class TruncatedPositionable extends TruncatedElement
{
    private int x;
    private int y;

    public TruncatedPositionable(String uuid, String className, int x, int y) {
        super(uuid, className);
        this.x = x;
        this.y = y;
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
}
