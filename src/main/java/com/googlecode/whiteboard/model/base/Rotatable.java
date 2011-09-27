/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.base;

/**
 * Base class of all rotatable elements.
 *
 * @author ova / last modified by $Author$
 * @version $Revision$
 */
public abstract class Rotatable extends AbstractElement
{
    private int rotationDegree;

    public int getRotationDegree() {
        return rotationDegree;
    }

    public void setRotationDegree(int rotationDegree) {
        this.rotationDegree = rotationDegree;
    }
}
