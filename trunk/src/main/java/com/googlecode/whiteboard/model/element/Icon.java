/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.element;

import com.googlecode.whiteboard.model.base.Positionable;

import java.io.Serializable;

/**
 * Model class for icon element.
 *
 * @author ova / last modified by $Author$
 * @version $Revision$
 */
public class Icon extends Positionable implements Serializable
{
    private static final long serialVersionUID = 20110506L;

    private String name;
    private double scaleFactor;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getScaleFactor() {
        return scaleFactor;
    }

    public void setScaleFactor(double scaleFactor) {
        this.scaleFactor = scaleFactor;
    }
}
