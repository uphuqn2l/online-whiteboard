/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.transfer;

import com.googlecode.whiteboard.model.base.AbstractElement;

/**
 * Base container for all truncated informations.
 *
 * @author ova / last modified by $Author$
 * @version $Revision$
 */
public class TruncatedElement extends AbstractElement
{
    private String className;

    public TruncatedElement(String uuid, String className) {
        super(uuid);
        this.className = className;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}
